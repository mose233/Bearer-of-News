import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Draft {
  id: string;
  title: string | null;
  content: string;
  status: string;
  created_at: string;
}

export default function ContentReview() {
  const { id } = useParams<{ id: string }>();

  const [draft, setDraft] = useState<Draft | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDraft(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchDraft = async (draftId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('content_drafts')
        .select('*')
        .eq('id', draftId)
        .maybeSingle();

      if (error) {
        console.error('Fetch draft error:', error);
        setDraft(null);
        return;
      }

      if (data) {
        setDraft(data);
        setContent(data.content || '');
      } else {
        setDraft(null);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const approveContent = async () => {
    if (!draft) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('content_drafts')
        .update({
          status: 'approved',
          content,
        })
        .eq('id', draft.id);

      if (error) {
        console.error('Approve error:', error);
        return;
      }

      alert('Content approved');
      fetchDraft(draft.id);
    } finally {
      setSaving(false);
    }
  };

  const rejectContent = async () => {
    if (!draft) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('content_drafts')
        .update({
          status: 'rejected',
        })
        .eq('id', draft.id);

      if (error) {
        console.error('Reject error:', error);
        return;
      }

      alert('Content rejected');
      fetchDraft(draft.id);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading content...</div>;
  }

  if (!draft) {
    return <div className="p-8">Content not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {draft.title || 'Untitled'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Status: {draft.status}
            </p>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px]"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={approveContent}
              disabled={saving}
            >
              Approve
            </Button>

            <Button
              variant="destructive"
              onClick={rejectContent}
              disabled={saving}
            >
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
