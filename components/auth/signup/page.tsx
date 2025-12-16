// page.tsx
import SignupContainer from "./SignupContainer";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onClose: () => void;
}

export default function Page({ onSwitchToSignIn, onClose }: SignUpFormProps) {
  return (
    <main className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
      <SignupContainer onSwitchToSignIn={onSwitchToSignIn} onClose={onClose} />
    </main>
  );
}
