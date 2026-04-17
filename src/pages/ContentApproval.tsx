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
author?: { email: string };
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

useEffect(() => {
if (user) loadTeam();
}, [user]);

useEffect(() => {
if (teamId) fetchDrafts();
}, [teamId]);

// LOAD TEAM
const loadTeam = async () => {
if (!user) return;

```
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
```

};

// FETCH DRAFTS
const fetchDrafts = async () => {
const { data } = await supabase
.from('content_drafts')
.select('*')
.order('created_at', { ascending: false });

```
if (data) setDrafts(data);
setLoading(false);
```

};

// CREATE DRAFT
const createDraft = async () => {
if (!newDraft.content || !user || !teamId) return;

```
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
```

};

// INVITE
const inviteMember = async () => {
if (!inviteEmail || !user || !teamId) return;

```
const { error } = await supabase
  .from('team_invitations')
  .insert({
    email: inviteEmail,
    team_id: teamId,
    invited_by: user.id,
    status: 'pending'
  });

if (error) {
  alert(error.message);
  return;
}

toast({ title: 'Invite sent' });
setInviteEmail('');
```

};

// SUBMIT + EMAIL
const submitForReview = async (id: string) => {
if (!user) return;

```
const draft = drafts.find(d => d.id === id);
if (!draft) return;

await supabase
  .from('content_drafts')
  .update({ status: 'pending' })
  .eq('id', id);

// EMAIL
try {
  await fetch(
    'https://bjclqqynzsljskfeqfdj.supabase.co/functions/v1/send-draft-email',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: user.email,
        draftTitle: draft.title || "Untitled",
        draftContent: draft.content,
        senderName: user.email
      }),
    }
  );
} catch (err) {
  console.error(err);
}

toast({ title: 'Submitted & email sent' });
fetchDrafts();
```

};

const filterDrafts = (status: string) =>
drafts.filter(d => d.status === status);

if (loading) return <div className="p-6">Loading...</div>;

return ( <div className="p-6 max-w-5xl mx-auto"> <div className="flex justify-between mb-6"> <h1 className="text-2xl font-bold">Content Approval</h1>

```
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
        <Button>Create Draft</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Draft</DialogTitle>
          <DialogDescription>Write content</DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Title"
          value={newDraft.title}
          onChange={(e) =>
            setNewDraft({ ...newDraft, title: e.target.value })
          }
        />

        <Textarea
          placeholder="Content..."
          value={newDraft.content}
          onChange={(e) =>
            setNewDraft({ ...newDraft, content: e.target.value })
          }
        />

        <Button onClick={createDraft}>Save Draft</Button>
      </DialogContent>
    </Dialog>
  </div>

  <Tabs defaultValue="draft">
    <TabsList>
      <TabsTrigger value="draft">Drafts</TabsTrigger>
      <TabsTrigger value="pending">Pending</TabsTrigger>
    </TabsList>

    {['draft', 'pending'].map(status => (
      <TabsContent key={status} value={status}>
        {filterDrafts(status).map(draft => (
          <Card key={draft.id} className="mb-4">
            <CardHeader>
              <CardTitle>{draft.title || "Untitled"}</CardTitle>
            </CardHeader>

            <CardContent>
              <p>{draft.content}</p>

              {status === 'draft' && (
                <Button onClick={() => submitForReview(draft.id)}>
                  Submit
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {filterDrafts(status).length === 0 && (
          <p>No {status} content</p>
        )}
      </TabsContent>
    ))}
  </Tabs>
</div>
```

);
}
