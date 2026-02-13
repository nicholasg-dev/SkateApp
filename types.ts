export enum RsvpStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  NO_REPLY = 'NO_REPLY'
}

export interface Player {
  id: string;
  name: string;
  email: string;
  skillLevel: number; // 1-10
  position: 'Forward' | 'Defense' | 'Goalie';
  status: RsvpStatus;
  role: 'Regular' | 'Sub';
  feesPaid: boolean;
  notes?: string;
}

export interface SessionConfig {
  date: string;
  time: string;
  location: string;
  maxPlayers: number;
  maxGoalies: number;
  inviteMessage: string;
}

export interface GeneratedTeam {
  teamName: string;
  players: string[];
}