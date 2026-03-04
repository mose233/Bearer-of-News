import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type TeamRole = 'admin' | 'editor' | 'viewer';

export interface TeamPermissions {
  canCreateContent: boolean;
  canEditContent: boolean;
  canApproveContent: boolean;
  canManageTeam: boolean;
  canInviteMembers: boolean;
  role: TeamRole | null;
}

export const useTeamPermissions = (teamId?: string) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<TeamPermissions>({
    canCreateContent: false,
    canEditContent: false,
    canApproveContent: false,
    canManageTeam: false,
    canInviteMembers: false,
    role: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      if (!user || !teamId) {
        setLoading(false);
        return;
      }

      try {
        // Check if user is team owner
        const { data: team } = await supabase
          .from('teams')
          .select('owner_id')
          .eq('id', teamId)
          .single();

        if (team?.owner_id === user.id) {
          setPermissions({
            canCreateContent: true,
            canEditContent: true,
            canApproveContent: true,
            canManageTeam: true,
            canInviteMembers: true,
            role: 'admin'
          });
          setLoading(false);
          return;
        }

        // Check team member role
        const { data: member } = await supabase
          .from('team_members')
          .select('role')
          .eq('team_id', teamId)
          .eq('user_id', user.id)
          .single();

        if (member) {
          const role = member.role as TeamRole;
          setPermissions({
            canCreateContent: role === 'admin' || role === 'editor',
            canEditContent: role === 'admin' || role === 'editor',
            canApproveContent: role === 'admin',
            canManageTeam: role === 'admin',
            canInviteMembers: role === 'admin',
            role
          });
        }
      } catch (error) {
        console.error('Error loading permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [user, teamId]);

  return { permissions, loading };
};
