import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, Shield, Eye, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TeamMember {
  id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'viewer';
  status: string;
  last_active: string;
  joined_at: string;
  email?: string;
}

export default function TeamManagement() {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const [teamId, setTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, [user]);

  const loadTeamData = async () => {
    if (!user) return;

    try {
      let { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!team) {
        const { data: newTeam } = await supabase
          .from('teams')
          .insert({ name: 'My Team', owner_id: user.id })
          .select()
          .single();
        team = newTeam;
      }

      setTeamId(team?.id);

      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', team?.id);

      setMembers(teamMembers || []);
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED INVITE SYSTEM (NO EMAIL DEPENDENCY)
  const handleInvite = async () => {
    console.log("Invite clicked");

    if (!teamId) {
      alert("Team not ready");
      return;
    }

    if (!inviteEmail) {
      alert("Enter email");
      return;
    }

    try {
      setInviteLoading(true);

      // 🔍 1. Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles') // make sure you have this table
        .select('id, email')
        .eq('email', inviteEmail)
        .single();

      if (!existingUser) {
        alert("User not found. Ask them to sign up first.");
        return;
      }

      // 🔍 2. Check if already in team
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', existingUser.id)
        .single();

      if (existingMember) {
        alert("User already in team");
        return;
      }

      // ✅ 3. Add to team
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: existingUser.id,
          role: inviteRole,
          status: 'active',
          joined_at: new Date().toISOString()
        });

      if (error) {
        console.error(error);
        alert("Failed to add member");
        return;
      }

      alert("Member added successfully!");

      setInviteEmail('');
      setInviteOpen(false);

      loadTeamData();

    } catch (err) {
      console.error("Crash:", err);
      alert("Something went wrong");
    } finally {
      setInviteLoading(false);
    }
  };

  const updateRole = async (memberId: string, newRole: string) => {
    await supabase
      .from('team_members')
      .update({ role: newRole })
      .eq('id', memberId);

    loadTeamData();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'editor': return <Edit className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8" />
            Team Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members and permissions
          </p>
        </div>

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Add an existing user to your team
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="user must already have account"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Role</Label>
                <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleInvite}
                className="w-full"
                disabled={inviteLoading}
              >
                {inviteLoading ? "Adding..." : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Add to Team
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members ({members.length})</CardTitle>
          <CardDescription>
            View and manage team member roles
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {getRoleIcon(member.role)}
                  </div>
                  <div>
                    <p className="font-medium">{member.email || 'User'}</p>
                    <p className="text-sm text-muted-foreground">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Select value={member.role} onValueChange={(v) => updateRole(member.id, v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}

            {members.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No team members yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
