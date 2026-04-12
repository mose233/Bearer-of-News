import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Draft {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  author: { email: string };
}

export default function ContentApproval() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
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
        author:profiles!content_drafts_user_id_fkey(email)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) setDrafts(data);
    setLoading(false);
  };

  const createDraft = async () => {
    if (!newDraft.title || !newDraft.content) {
      alert("Fill all fields");
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
      alert("Failed to create draft");
      return;
    }

    toast({ title: 'Draft created successfully' });

    setCreateDialog(false);
    setNewDraft({ title: '', content: '' });

    fetchDrafts();
  };

  const submitForReview = async (id: string) => {
    await supabase
      .from('content_drafts')
      .update({ status: 'pending' })
      .eq('id', id);

    fetchDrafts();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge>Draft</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  const filterDrafts = (status: string) =>
    drafts.filter(d => d.status === status);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Content Approval</h1>

        {/* ✅ ALWAYS ENABLED */}
        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogTrigger asChild>
            <Button>Create Draft</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Draft</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={newDraft.title}
                onChange={(e) =>
                  setNewDraft({ ...newDraft, title: e.target.value })
                }
              />

              <Textarea
                rows={6}
                placeholder="Write content..."
                value={newDraft.content}
                onChange={(e) =>
                  setNewDraft({ ...newDraft, content: e.target.value })
                }
              />

              <Button onClick={createDraft} className="w-full">
                Save Draft
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="draft">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="draft">
            Drafts ({filterDrafts('draft').length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filterDrafts('pending').length})
          </TabsTrigger>
        </TabsList>

        {['draft', 'pending'].map(status => (
          <TabsContent key={status} value={status}>
            {filterDrafts(status).map(draft => (
              <Card key={draft.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{draft.title}</CardTitle>
                  {getStatusBadge(draft.status)}
                </CardHeader>

                <CardContent>
                  <p className="mb-3">{draft.content}</p>

                  {status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => submitForReview(draft.id)}
                    >
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
