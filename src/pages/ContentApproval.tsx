import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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

  const [teamId, setTeamId] = useState<string | null>(null);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  useEffect(() => {
    if (user) {
      loadTeam();
    }
  }, [user]);

  useEffect(() => {
    if (teamId) {
      fetchDrafts();
    }
  }, [teamId]);

  // ✅ LOAD OR CREATE TEAM (FIXED PROPERLY)
  const loadTeam = async () => {
    console.log("🔄 Loading team...");

    const { data: team, error } = await supabase
      .from('teams')
      .select('id')
      .eq('owner_id', user?.id)
      .maybeSingle();

    console.log("👥 Team fetch:", { team, error });

    if (error) {
      console.error("❌ Team fetch error:", error);
      return;
    }

    if (team) {
      console.log("✅ Existing team found:", team.id);
      setTeamId(team.id);
      return;
    }

    // 🚨 Prevent infinite loop
    if (isCreatingTeam) return;

    setIsCreatingTeam(true);

    console.log("⚠️ No team → creating one...");

    const { data: newTeam, error: createError } = await supabase
      .from('teams')
      .insert({
        name: 'My Team',
        owner_id: user?.id
      })
      .select()
      .single();

    console.log("🛠️ Create team result:", { newTeam, createError });

    if (createError) {
      console.error("❌ Create team error:", createError);
      return;
    }

    setTeamId(newTeam.id);
  };

  // ✅ FETCH DRAFTS
  const fetchDrafts = async () => {
    console.log("📥 Fetching drafts...");

    const { data, error } = await supabase
      .from('content_drafts')
      .select(`
        *,
        author:profiles!content_drafts_user_id_fkey(email)
      `)
      .order('created_at', { ascending: false });

    console.log("📊 Draft fetch result:", { data, error });

    if (error) {
      console.error("❌ Fetch drafts error:", error);
      return;
    }

    if (data) setDrafts(data);
    setLoading(false);
  };

  // ✅ CREATE DRAFT (SAFE)
  const createDraft = async () => {
    if (!newDraft.content) {
      alert("Content is required");
      return;
    }

    if (!user || !teamId) {
      alert("User or Team not ready yet");
      return;
    }

    console.log("📝 Creating draft...", {
      title: newDraft.title,
      content: newDraft.content,
      user_id: user.id,
      team_id: teamId
    });

    const { data, error } = await supabase
      .from('content_drafts')
      .insert([
        {
          title: newDraft.title || null,
          content: newDraft.content,
          user_id: user.id,
          team_id: teamId,
          status: 'draft'
        }
      ])
      .select();

    console.log("📦 Insert result:", { data, error });

    if (error) {
      console.error("❌ Insert error:", error);
      alert("Failed to create draft");
      return;
    }

    toast({ title: 'Draft saved successfully' });

    setCreateDialog(false);
    setNewDraft({ title: '', content: '' });

    fetchDrafts();
  };

  // ✅ SUBMIT FOR REVIEW
  const submitForReview = async (id: string) => {
    console.log("📤 Submitting draft:", id);

    const { error } = await supabase
      .from('content_drafts')
      .update({ status: 'pending' })
      .eq('id', id);

    if (error) {
      console.error("❌ Submit error:", error);
      alert("Failed to submit");
      return;
    }

    toast({ title: 'Submitted for review' });

    fetchDrafts();
  };

  // ✅ STATUS BADGES
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge><FileText className="w-3 h-3 mr-1" />Draft</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const filterDrafts = (status: string) =>
    drafts.filter(d => d.status === status);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Content Approval</h1>

        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogTrigger asChild>
            <Button disabled={!teamId}>Create Draft</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Draft</DialogTitle>
              <DialogDescription>
                Write your content and save as draft
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Title (optional)"
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
                  <CardTitle>{draft.title || "Untitled"}</CardTitle>
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

            {filterDrafts(status).length === 0 && (
              <p className="text-center text-muted-foreground mt-6">
                No {status} content
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
