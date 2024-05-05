export type Message = {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    firstName: string;
  };
  channel: {
    id: number;
  };
  workspace: {
    id: number;
    title: string;
  };
};
