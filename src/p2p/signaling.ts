export type CallSignal =
  | { type: "offer"; callId: string; video: boolean; sdp: string }
  | { type: "answer"; callId: string; sdp: string }
  | { type: "candidate"; callId: string; candidate: unknown }
  | { type: "hangup"; callId: string }
  | { type: "camera"; callId: string; on: boolean };
