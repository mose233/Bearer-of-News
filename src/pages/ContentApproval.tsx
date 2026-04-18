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
  title: string | null;
  content: string;
  status: string;
  created_at: string;
}

export default function ContentApproval() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialog, setCreateDialog] = useState(false);
  const [newDraft, setNewDraft] = useState({ title: '', content: '' });

  const [teamId, setTeamId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');

  // =========================
  // LOAD TEAM
  // =========================
  useEffect(() => {
    if (user) loadTeam();
  }, [user]);

  const loadTeam = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('teams')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1);

    if (data && data.length > 0) {
      setTeamId(data[0].id);
      return;
    }

    const { data: newTeam } = await supabase
      .from('teams')
      .insert({
        name: 'My Team',
        owner_id: user.id
      })
      .select();

    if (newTeam && newTeam.length > 0) {
      setTeamId(newTeam[0].id);
    }
  };

  // =========================
  // FETCH DRAFTS
  // =========================
  useEffect(() => {
    if (teamId) fetchDrafts();
  }, [teamId]);

  const fetchDrafts = async () => {
    const { data, error } = await supabase
      .from('content_drafts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    if (data) setDrafts(data);
    setLoading(false);
  };

  // =========================
  // CREATE DRAFT
  // =========================
  const createDraft = async () => {
    if (!newDraft.content) {
      alert('Content is required');
      return;
    }

    if (!user || !teamId) {
      alert('User or team not ready');
      return;
    }

    const { error } = await supabase
      .from('content_drafts')
      .insert({
        title: newDraft.title || null,
        content: newDraft.content,
        user_id: user.id,
        team_id: teamId,
        status: 'draft'
      });

    if (error) {
      alert(error.message);
      return;
    }

    toast({ title: 'Draft saved' });

    setCreateDialog(false);
    setNewDraft({ title: '', content: '' });

    fetchDrafts();
  };

  // =========================
  // INVITE MEMBER
  // =========================
  const inviteMember = async () => {
    if (!inviteEmail || !teamId || !user) {
      alert('Missing data');
      return;
    }

    const { error } = await supabase
      .from('team_invitations')
      .insert({
        email: inviteEmail.trim(),
        team_id: teamId,
        invited_by: user.id,
        status: 'pending'
      });

    if (error) {
      alert(error.message);
      return;
    }

    toast({ title: 'Invitation sent' });
    setInviteEmail('');
  };

  // =========================
  // SUBMIT + EMAIL (FIXED)
  // =========================
  const submitForReview = async (id: string) => {
    console.log("🚀 Submitting:", id);

    if (!user || !user.email) {
      alert("User email missing");
      return;
    }

    const draft = drafts.find(d => d.id === id);

    if (!draft) {
      alert("Draft not found");
      return;
    }

    // 1️⃣ Update status
    const { error } = await supabase
      .from('content_drafts')
      .update({ status: 'pending' })
      .eq('id', id);

    if (error) {
      console.error(error);
      alert('Failed to submit');
      return;
    }

    // 2️⃣ Send email (FIXED PAYLOAD)
    try {
      const res = await fetch(
        'https://bjclqqynzsljskfeqfdj.supabase.co/functions/v1/send-draft-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: user.email,
            subject: "New Draft Submitted",
            draftTitle: draft.title ?? "Untitled",
            draftContent: draft.content ?? "",
            senderName: user.email
          })
        }
      );

      const data = await res.json();
      console.log("📧 Email response:", data);

      if (!res.ok) {
        console.error("Email failed:", data);
      }

    } catch (err) {
      console.error("❌ Email error:", err);
    }

    toast({ title: 'Submitted & email triggered' });
    fetchDrafts();
  };

  // =========================
  // UI HELPERS
  // =========================
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

  // =========================
  // UI
  // =========================
  return (
    <div className="container mx-auto p-6 max-w-6xl">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Content Approval</h1>

        <div className="flex gap-2">
          <Input
            placeholder="Invite email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <Button onClick={inviteMember}>Invite</Button>
        </div>

        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogTrigger asChild>
            <Button disabled={!teamId}>Create Draft</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Draft</DialogTitle>
              <DialogDescription>Write content</DialogDescription>
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
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
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
                  <p>{draft.content}</p>

                  {status === 'draft' && (
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
