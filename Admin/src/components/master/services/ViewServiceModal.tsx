import type { Service } from "../../../common/types/types";
import Modal from "../../common/modal/Modal";

type Props = {
  service: Service;
  onClose: () => void;
};

const ViewServiceModal = ({ service, onClose }: Props) => {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Service Details</h2>

      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Name</p>
          <p>{service.name}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Slug</p>
          <p>{service.slug}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Description</p>
          <p>{service.description || "-"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Status</p>
          <p>{service.isActive ? "Active" : "Inactive"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Created</p>
          <p>
            {service.createdAt
              ? new Date(service.createdAt).toLocaleDateString()
              : "-"}
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 rounded-lg"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewServiceModal;