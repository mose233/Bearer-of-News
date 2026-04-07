import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useTeamPermissions } from '@/hooks/useTeamPermissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, FileText, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ApprovalStats from '@/components/ApprovalStats';
import { sendContentNotificationEmail } from '@/utils/notificationEmailService';




interface Draft {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  submitted_at: string;
  reviewed_at: string;
  author: { email: string };
  reviewer: { email: string } | null;
}

export default function ContentApproval() {
  const { user } = useAuth();
  const { canApprove, canCreate } = useTeamPermissions();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [newDraft, setNewDraft] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    const { data, error } = await supabase
      .from('content_drafts')
      .select(`
        *,
        author:users!content_drafts_user_id_fkey(email),
        reviewer:users!content_drafts_reviewed_by_fkey(email)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) setDrafts(data);
    setLoading(false);
  };

  const createDraft = async () => {
    if (!newDraft.title || !newDraft.content) return;

    const { error } = await supabase.from('content_drafts').insert({
      title: newDraft.title,
      content: newDraft.content,
      user_id: user?.id,
      status: 'draft'
    });

    if (!error) {
      toast({ title: 'Draft created successfully' });
      setCreateDialog(false);
      setNewDraft({ title: '', content: '' });
      fetchDrafts();
    }
  };

  
  const submitForReview = async (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    
    const { error } = await supabase
      .from('content_drafts')
      .update({ status: 'pending', submitted_at: new Date().toISOString() })
      .eq('id', draftId);

    if (!error) {
      // Get all reviewers (users with approval permissions)
      const { data: reviewers } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'admin'); // Or your reviewer role logic
      
      // Create in-app notification for reviewers
      if (reviewers && reviewers.length > 0) {
        for (const reviewer of reviewers) {
          await supabase.from('notifications').insert({
            user_id: reviewer.id,
            title: 'New Content Submitted 📝',
            message: `"${draft?.title}" has been submitted for review`,
            notification_type: 'content_submitted',
            related_id: draftId,
            is_read: false
          });
          
          // Send email notification if enabled in preferences
          await sendContentNotificationEmail({
            userId: reviewer.id,
            draftTitle: draft?.title || '',
            notificationType: 'content_submitted'
          });
        }
      }
      
      toast({ title: 'Submitted for review' });
      fetchDrafts();
    }
  };

  const reviewDraft = async (draftId: string, action: 'approve' | 'reject') => {
    const draft = drafts.find(d => d.id === draftId);
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    // Get author user ID
    const { data: authorData } = await supabase
      .from('content_drafts')
      .select('user_id')
      .eq('id', draftId)
      .single();
    
    const { error } = await supabase.from('content_drafts').update({
      status: newStatus,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString()
    }).eq('id', draftId);

    if (!error && reviewComment) {
      await supabase.from('approval_comments').insert({
        draft_id: draftId,
        user_id: user?.id,
        comment: reviewComment,
        action
      });
    }

    if (!error && authorData) {
      // Create in-app notification for author
      await supabase.from('notifications').insert({
        user_id: authorData.user_id,
        title: action === 'approve' ? 'Content Approved ✅' : 'Content Rejected ❌',
        message: action === 'approve' 
          ? `Your content "${draft?.title}" has been approved!`
          : `Your content "${draft?.title}" needs revision.`,
        notification_type: `content_${action}ed`,
        related_id: draftId,
        is_read: false
      });
      
      // Send email notification if enabled in preferences
      await sendContentNotificationEmail({
        userId: authorData.user_id,
        draftTitle: draft?.title || '',
        notificationType: action === 'approve' ? 'content_approved' : 'content_rejected',
        reviewerName: user?.email || 'Reviewer',
        comment: reviewComment
      });
      
      toast({ title: `Draft ${action}ed successfully` });
      setReviewDialog(null);
      setReviewComment('');
      fetchDrafts();
    }
  };



  const getStatusBadge = (status: string) => {
    const variants = {
      draft: <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />Draft</Badge>,
      pending: <Badge variant="outline" className="bg-yellow-50"><Clock className="w-3 h-3 mr-1" />Pending</Badge>,
      approved: <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>,
      rejected: <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
    };
    return variants[status] || null;
  };

  const filterDrafts = (status: string) => drafts.filter(d => d.status === status);

  const stats = {
    draft: filterDrafts('draft').length,
    pending: filterDrafts('pending').length,
    approved: filterDrafts('approved').length,
    rejected: filterDrafts('rejected').length
  };


  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Approval Workflow</h1>
        {canCreate && (
          <Dialog open={createDialog} onOpenChange={setCreateDialog}>
            <DialogTrigger asChild>
              <Button>Create New Draft</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Content Draft</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={newDraft.title} onChange={(e) => setNewDraft({...newDraft, title: e.target.value})} />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea rows={6} value={newDraft.content} onChange={(e) => setNewDraft({...newDraft, content: e.target.value})} />
                </div>
                <Button onClick={createDraft} className="w-full">Create Draft</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <ApprovalStats stats={stats} />

      <Tabs defaultValue="pending" className="w-full">

        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending ({filterDrafts('pending').length})</TabsTrigger>
          <TabsTrigger value="draft">Drafts ({filterDrafts('draft').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({filterDrafts('approved').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({filterDrafts('rejected').length})</TabsTrigger>
        </TabsList>

        {['pending', 'draft', 'approved', 'rejected'].map(status => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filterDrafts(status).map(draft => (
              <Card key={draft.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{draft.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        By {draft.author?.email} • {new Date(draft.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(draft.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 line-clamp-2">{draft.content}</p>
                  <div className="flex gap-2">
                    {draft.status === 'draft' && draft.author?.email === user?.email && (
                      <Button size="sm" onClick={() => submitForReview(draft.id)}>Submit for Review</Button>
                    )}
                    {draft.status === 'pending' && canApprove && (
                      <Dialog open={reviewDialog === draft.id} onOpenChange={(open) => setReviewDialog(open ? draft.id : null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline"><MessageSquare className="w-4 h-4 mr-1" />Review</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Review: {draft.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm">{draft.content}</p>
                            <div>
                              <Label>Comment (optional)</Label>
                              <Textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Add feedback..." />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => reviewDraft(draft.id, 'approve')} className="flex-1 bg-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />Approve
                              </Button>
                              <Button onClick={() => reviewDraft(draft.id, 'reject')} variant="destructive" className="flex-1">
                                <XCircle className="w-4 h-4 mr-1" />Reject
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filterDrafts(status).length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No {status} content
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
