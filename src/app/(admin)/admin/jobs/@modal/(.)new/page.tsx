import JobForm from "@/app/(admin)/_components/JobForm";
import Modal from "@/shared/ui/Modal";

export default function NewJobModal() {
  return (
    <Modal onCloseHref="/jobs">
      <JobForm />
    </Modal>
  );
}
