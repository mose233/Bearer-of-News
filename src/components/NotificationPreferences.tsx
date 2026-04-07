import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function NotificationPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    in_app_notifications: true,
    content_submitted: true,
    content_approved: true,
    content_rejected: true,
    comments_added: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('users')
      .select('notification_preferences')
      .eq('id', user.id)
      .single();

    if (data?.notification_preferences) {
      setPreferences(data.notification_preferences);
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('users')
      .update({ notification_preferences: preferences })
      .eq('id', user?.id);

    if (error) {
      toast({ title: 'Error saving preferences', variant: 'destructive' });
    } else {
      toast({ title: 'Preferences saved successfully' });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email">Email Notifications</Label>
          <Switch id="email" checked={preferences.email_notifications} 
            onCheckedChange={(v) => setPreferences({...preferences, email_notifications: v})} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="inapp">In-App Notifications</Label>
          <Switch id="inapp" checked={preferences.in_app_notifications} 
            onCheckedChange={(v) => setPreferences({...preferences, in_app_notifications: v})} />
        </div>
        <div className="border-t pt-4 space-y-4">
          <p className="text-sm font-medium">Notify me when:</p>
          <div className="flex items-center justify-between">
            <Label htmlFor="submitted">Content is submitted</Label>
            <Switch id="submitted" checked={preferences.content_submitted} 
              onCheckedChange={(v) => setPreferences({...preferences, content_submitted: v})} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="approved">Content is approved</Label>
            <Switch id="approved" checked={preferences.content_approved} 
              onCheckedChange={(v) => setPreferences({...preferences, content_approved: v})} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="rejected">Content is rejected</Label>
            <Switch id="rejected" checked={preferences.content_rejected} 
              onCheckedChange={(v) => setPreferences({...preferences, content_rejected: v})} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="comments">Comments are added</Label>
            <Switch id="comments" checked={preferences.comments_added} 
              onCheckedChange={(v) => setPreferences({...preferences, comments_added: v})} />
          </div>
        </div>
        <Button onClick={savePreferences} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
}
