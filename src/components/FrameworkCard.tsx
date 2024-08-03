import { Framework } from '@/types/framework'
import Link from 'next/link'
import { useState } from 'react'
import Modal from './Modal'
import Button from '@/components/ui/Button';

interface FrameworkCardProps {
  framework: Framework;
  onDelete: (id: string) => void;
  onClone: (id: string) => void;
  onArchive: (id: string) => void;
  onEdit?: (id: string) => void;
  isArchived: boolean;
}

const FrameworkCard: React.FC<FrameworkCardProps> = ({ framework, onDelete, onClone, onArchive, onEdit, isArchived }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'delete' | 'archive'>('delete');

  const handleDeleteClick = () => {
    setModalAction('delete');
    setIsModalOpen(true);
  };

  const handleArchiveClick = () => {
    setModalAction('archive');
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (modalAction === 'delete') {
      onDelete(framework.id);
    } else if (modalAction === 'archive') {
      onArchive(framework.id);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">{framework.name}</h2>
      <p className="text-gray-600 mb-4">{framework.description}</p>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit && onEdit(framework.id)}>
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={handleDeleteClick} className="text-red-500">
          Delete
        </Button>
        <Button variant="outline" size="sm" onClick={handleArchiveClick} className="text-yellow-500">
          Archive
        </Button>
        <Button variant="outline" size="sm" onClick={() => onClone(framework.id)} className="text-purple-500">
          Clone
        </Button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Confirm ${modalAction}`}
        actions={
          <>
            <Button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800">Cancel</Button>
            <Button onClick={handleConfirm} className="bg-blue-500 text-white">Confirm</Button>
          </>
        }
      >
        <p>Are you sure you want to {modalAction} this framework?</p>
      </Modal>
    </div>
  )
}

export default FrameworkCard