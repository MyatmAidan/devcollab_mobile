import type { User } from './user';

export type MeetingStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Meeting {
  id: string;
  organizer_id: string;
  participant_id: string;
  connection_id: string | null;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  meeting_url: string | null;
  status: MeetingStatus;
  organizer?: User;
  participant?: User;
  created_at: string;
}

export interface StoreMeetingInput {
  participant_id: string;
  connection_id?: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes?: number;
  meeting_url?: string;
}

export interface UpdateMeetingInput {
  title?: string;
  description?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  meeting_url?: string;
}
