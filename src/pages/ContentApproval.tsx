import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Draft {
  id: string;
  title: string | null;
  content: string;
  status: string;
  created_at: string;
}

export default function ContentApproval() {
  const { id } = useParams();

  const { user } = useAuth();
  const { toast } = useToast();

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  const [teamId, setTeamId] =
    useState<string | null>(null);

  const [inviteEmail, setInviteEmail] =
    useState('');

  const [teamMembers, setTeamMembers] =
    useState<string[]>([]);

  const [selectedEmail, setSelectedEmail] =
    useState('');

  const [reviewDraft, setReviewDraft] =
    useState<Draft | null>(null);

  const [reviewLoading, setReviewLoading] =
    useState(false);

  // =========================
  // NEW CONTENT FORM
  // =========================
  const [newContent, setNewContent] =
    useState({
      title: '',
      content: '',
    });

  // =========================
  // UUID VALIDATOR
  // =========================
  const isValidUUID = (value: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return uuidRegex.test(value);
  };

  // =========================
  // LOAD TEAM
  // =========================
  useEffect(() => {
    if (user) {
      loadTeam();
    }
  }, [user]);

  const loadTeam = async () => {
    if (!user) return;

    try {
      const { data: existingTeam } =
        await supabase
          .from('teams')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1);

      let finalTeamId: string | null =
        null;

      if (
        existingTeam &&
        existingTeam.length > 0
      ) {
        finalTeamId = existingTeam[0].id;
      } else {
        const {
          data: newTeam,
          error,
        } = await supabase
          .from('teams')
          .insert({
            name: 'My Team',
            owner_id: user.id,
          })
          .select()
          .single();

        if (error) {
          console.error(error);

          toast({
            title:
              'Failed to create team',
          });

          return;
        }

        finalTeamId = newTeam.id;
      }

      setTeamId(finalTeamId);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // LOAD TEAM DATA
  // =========================
  useEffect(() => {
    if (teamId) {
      fetchDrafts();
      fetchTeamMembers();
    }
  }, [teamId]);

  // =========================
  // LOAD SINGLE REVIEW
  // =========================
  useEffect(() => {
    if (!id) return;

    // PREVENT "demo" / invalid IDs
    if (!isValidUUID(id)) {
      console.error(
        'Invalid draft ID:',
        id
      );

      setReviewDraft(null);
      setReviewLoading(false);

      return;
    }

    fetchSingleDraft(id);
  }, [id]);

  // =========================
  // FETCH SINGLE DRAFT
  // =========================
  const fetchSingleDraft = async (
    draftId: string
  ) => {
    try {
      setReviewLoading(true);

      const { data, error } =
        await supabase
          .from('content_drafts')
          .select('*')
          .eq('id', draftId)
          .maybeSingle();

      if (error) {
        console.error(error);

        setReviewDraft(null);

        return;
      }

      setReviewDraft(data || null);
    } catch (err) {
      console.error(err);

      setReviewDraft(null);
    } finally {
      setReviewLoading(false);
    }
  };

  // =========================
  // FETCH DRAFTS
  // =========================
  const fetchDrafts = async () => {
    try {
      const { data, error } =
        await supabase
          .from('content_drafts')
          .select('*')
          .eq('team_id', teamId)
          .order('created_at', {
            ascending: false,
          });

      if (error) {
        console.error(error);
        return;
      }

      setDrafts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH MEMBERS
  // =========================
  const fetchTeamMembers =
    async () => {
      if (!teamId) return;

      try {
        const { data, error } =
          await supabase
            .from('team_invitations')
            .select('email')
            .eq('team_id', teamId);

        if (error) {
          console.error(error);
          return;
        }

        const uniqueEmails = [
          ...new Set(
            (data || []).map(
              (item) => item.email
            )
          ),
        ];

        setTeamMembers(uniqueEmails);

        if (
          uniqueEmails.length > 0 &&
          !selectedEmail
        ) {
          setSelectedEmail(
            uniqueEmails[0]
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

  // =========================
  // INVITE MEMBER
  // =========================
  const inviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: 'Please enter email',
      });

      return;
    }

    if (!teamId) {
      toast({
        title: 'Team not ready',
      });

      return;
    }

    try {
      const email = inviteEmail
        .trim()
        .toLowerCase();

      if (teamMembers.includes(email)) {
        toast({
          title:
            'Member already invited',
        });

        return;
      }

      const { error } = await supabase
        .from('team_invitations')
        .insert({
          email,
          team_id: teamId,
          invited_by: user?.id,
          status: 'pending',
        });

      if (error) {
        console.error(error);

        toast({
          title:
            'Invitation failed',
        });

        return;
      }

      setInviteEmail('');

      toast({
        title: 'Invitation sent',
      });

      fetchTeamMembers();
    } catch (err) {
      console.error(err);

      toast({
        title:
          'Unexpected error',
      });
    }
  };

  // =========================
  // SEND CONTENT
  // =========================
  const sendContent = async () => {
    if (!selectedEmail) {
      toast({
        title:
          'Please select recipient',
      });

      return;
    }

    if (!newContent.title.trim()) {
      toast({
        title: 'Title is required',
      });

      return;
    }

    if (!newContent.content.trim()) {
      toast({
        title:
          'Content is required',
      });

      return;
    }

    try {
      // SAVE FIRST
      const {
        data: savedDraft,
        error: saveError,
      } = await supabase
        .from('content_drafts')
        .insert({
          title: newContent.title,
          content:
            newContent.content,
          status: 'pending',
          user_id: user?.id,
          team_id: teamId,
        })
        .select()
        .single();

      if (
        saveError ||
        !savedDraft
      ) {
        console.error(saveError);

        toast({
          title:
            'Failed to save content',
        });

        return;
      }

      // SAFE REVIEW URL
      const reviewUrl = `https://xnewsapp.com/content-review/${savedDraft.id}`;

      // SEND EMAIL
      const response = await fetch(
        'https://bjclqqynzsljskfeqfdj.supabase.co/functions/v1/send-draft-email',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email: selectedEmail,

            subject:
              newContent.title,

            draftId:
              savedDraft.id,

            content: `
              <div style="font-family:Arial,sans-serif;padding:20px;max-width:700px;margin:auto;">

                <h1 style="color:#1877F2;margin-bottom:20px;">
                  ${newContent.title}
                </h1>

                <div style="
                  background:#f5f5f5;
                  padding:20px;
                  border-radius:10px;
                  line-height:1.7;
                  font-size:16px;
                  color:#222;
                  white-space:pre-wrap;
                ">
                  ${newContent.content}
                </div>

                <p style="margin-top:30px;font-size:14px;color:#666;">
                  Submitted by:
                  <strong>${user?.email}</strong>
                </p>

                <div style="margin-top:25px;">
                  <a
                    href="${reviewUrl}"
                    style="
                      background:#1877F2;
                      color:white;
                      padding:14px 20px;
                      border-radius:8px;
                      text-decoration:none;
                      font-weight:bold;
                      display:inline-block;
                    "
                  >
                    View and Review Content
                  </a>
                </div>

              </div>
            `,
          }),
        }
      );

      if (!response.ok) {
        toast({
          title:
            'Failed to send email',
        });

        return;
      }

      toast({
        title: `Sent to ${selectedEmail}`,
      });

      // RESET FORM
      setNewContent({
        title: '',
        content: '',
      });

      fetchDrafts();
    } catch (err) {
      console.error(err);

      toast({
        title:
          'Unexpected sending error',
      });
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  // =========================
  // REVIEW PAGE
  // =========================
  if (id) {
    if (reviewLoading) {
      return (
        <div className="container mx-auto p-6">
          Loading content...
        </div>
      );
    }

    if (!reviewDraft) {
      return (
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold">
            Content not found.
          </h1>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {reviewDraft.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="whitespace-pre-wrap text-lg leading-8">
              {reviewDraft.content}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">
        Content Approval
      </h1>

      {/* RECIPIENT */}
      <div className="mb-6 space-y-3">
        <label className="text-sm font-semibold">
          Select Recipient
        </label>

        <select
          className="border p-3 rounded w-full bg-white"
          value={selectedEmail}
          onChange={(e) =>
            setSelectedEmail(
              e.target.value
            )
          }
        >
          {teamMembers.length === 0 ? (
            <option value="">
              No invited members yet
            </option>
          ) : (
            <>
              <option value="">
                -- Select recipient --
              </option>

              {teamMembers.map(
                (email) => (
                  <option
                    key={email}
                    value={email}
                  >
                    {email}
                  </option>
                )
              )}
            </>
          )}
        </select>

        <div className="flex gap-2">
          <Input
            placeholder="Invite email"
            value={inviteEmail}
            onChange={(e) =>
              setInviteEmail(
                e.target.value
              )
            }
          />

          <Button onClick={inviteMember}>
            Invite
          </Button>
        </div>
      </div>

      {/* SEND FORM */}
      <div className="mb-6 space-y-3">
        <Input
          placeholder="Title"
          value={newContent.title}
          onChange={(e) =>
            setNewContent({
              ...newContent,
              title: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Write your content..."
          value={newContent.content}
          onChange={(e) =>
            setNewContent({
              ...newContent,
              content:
                e.target.value,
            })
          }
          className="w-full border rounded p-3 min-h-[220px]"
        />

        <Button onClick={sendContent}>
          Send Content
        </Button>
      </div>

      {/* DRAFTS */}
      <Tabs defaultValue="pending">
        <TabsList className="grid grid-cols-1">
          <TabsTrigger value="pending">
            Sent Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {drafts.filter(
            (draft) =>
              draft.status ===
              'pending'
          ).length === 0 ? (
            <p className="mt-4 text-gray-500">
              No sent content yet
            </p>
          ) : (
            drafts
              .filter(
                (draft) =>
                  draft.status ===
                  'pending'
              )
              .map((draft) => (
                <Card
                  key={draft.id}
                  className="mb-4"
                >
                  <CardHeader>
                    <CardTitle>
                      {draft.title ||
                        'Untitled'}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="whitespace-pre-wrap">
                      {draft.content}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
