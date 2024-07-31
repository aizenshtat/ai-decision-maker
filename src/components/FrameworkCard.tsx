import { Framework } from '@/types/framework'
import Link from 'next/link'
import { useState } from 'react'
import Modal from './Modal'
import { Button } from './ui'

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
      <div className="flex space-x-4">
        <Link href={`/frameworks/${framework.id}`} className="text-blue-500 hover:text-blue-700">
          View Details
        </Link>
        {!isArchived && framework.id !== 'default' && (
          <>
            {onEdit && (
              <button onClick={() => onEdit(framework.id)} className="text-green-500 hover:text-green-700">
                Edit
              </button>
            )}
            <button onClick={handleDeleteClick} className="text-red-500 hover:text-red-700">
              Delete
            </button>
            <button onClick={handleArchiveClick} className="text-yellow-500 hover:text-yellow-700">
              Archive
            </button>
          </>
        )}
        <button onClick={() => onClone(framework.id)} className="text-purple-500 hover:text-purple-700">
          Clone
        </button>
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