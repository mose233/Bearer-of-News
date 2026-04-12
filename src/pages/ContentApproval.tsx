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

  // ✅ FIXED STATE
  const [newDraft, setNewDraft] = useState<{ title: string; content: string }>({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    const { data, error } = await supabase
      .from('content_drafts')
      .select(`
        *,
        author:profiles!content_drafts_user_id_fkey(email),
        reviewer:profiles!content_drafts_reviewed_by_fkey(email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    }

    if (data) setDrafts(data);
    setLoading(false);
  };

  const createDraft = async () => {
    if (!newDraft.title || !newDraft.content) {
      toast({ title: 'Fill all fields' });
      return;
    }

    const { error } = await supabase.from('content_drafts').insert({
      title: newDraft.title,
      content: newDraft.content,
      user_id: user?.id,
      status: 'draft'
    });

    if (error) {
      console.error(error);
      toast({ title: 'Error creating draft' });
      return;
    }

    toast({ title: 'Draft created successfully' });

    setCreateDialog(false);
    setNewDraft({ title: '', content: '' });
    fetchDrafts();
  };

  const submitForReview = async (draftId: string) => {
    const { error } = await supabase
      .from('content_drafts')
      .update({
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
      .eq('id', draftId);

    if (error) {
      console.error(error);
      return;
    }

    toast({ title: 'Submitted for review' });
    fetchDrafts();
  };

  const reviewDraft = async (draftId: string, action: 'approve' | 'reject') => {
    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    const { error } = await supabase
      .from('content_drafts')
      .update({
        status: newStatus,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', draftId);

    if (error) {
      console.error(error);
      return;
    }

    if (reviewComment) {
      await supabase.from('approval_comments').insert({
        draft_id: draftId,
        user_id: user?.id,
        comment: reviewComment,
        action
      });
    }

    toast({ title: `Draft ${action}ed successfully` });

    setReviewDialog(null);
    setReviewComment('');
    fetchDrafts();
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      draft: <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />Draft</Badge>,
      pending: <Badge variant="outline" className="bg-yellow-50"><Clock className="w-3 h-3 mr-1" />Pending</Badge>,
      approved: <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>,
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
                  <Input
                    value={newDraft.title}
                    onChange={(e) =>
                      setNewDraft((prev) => ({
                        ...prev,
                        title: e.target.value
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Content</Label>
                  <Textarea
                    rows={6}
                    value={newDraft.content}
                    onChange={(e) =>
                      setNewDraft((prev) => ({
                        ...prev,
                        content: e.target.value
                      }))
                    }
                  />
                </div>

                <Button onClick={createDraft} className="w-full">
                  Create Draft
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <ApprovalStats stats={stats} />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="draft">Drafts ({stats.draft})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
        </TabsList>

        {['pending', 'draft', 'approved', 'rejected'].map(status => (
          <TabsContent key={status} value={status}>
            {filterDrafts(status).map(draft => (
              <Card key={draft.id}>
                <CardHeader>
                  <CardTitle>{draft.title}</CardTitle>
                  {getStatusBadge(draft.status)}
                </CardHeader>

                <CardContent>
                  <p>{draft.content}</p>

                  {draft.status === 'draft' && (
                    <Button onClick={() => submitForReview(draft.id)}>
                      Submit for Review
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
