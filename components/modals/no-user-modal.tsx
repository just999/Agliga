'use client';

import useModal from '@/hooks/use-modal';
import Modal from './modal';
import Heading from '../heading';
import { useRouter } from 'next/navigation';

type NoUserModalProps = {};

const NoUserModal = () => {
  const { modalType, onOpen, isOpen, onClose, id } = useModal();

  const router = useRouter();

  const bodyContent = (
    <div className='flex flex-col gap-1'>
      <Heading
        title=''
        subtitle='Please login or register to perform this task'
      />

      {/* {modalType} */}
    </div>
  );

  const onLoggedIn = () => {
    onOpen('login');
  };
  return (
    <Modal
      isOpen={isOpen && modalType === 'no-user'}
      onClose={onClose}
      onSubmit={onLoggedIn}
      title='Not logged in?'
      actionLabel='Log-in'
      disabled={false}
      body={bodyContent}
      // secondaryAction={onClose}
      // secondaryActionLabel='cancel'
      // footer={footerContent}
    />
    // <Modal isOpen={isOpen} onClose={onClose} />
    // <div>HAI!</div>
  );
};

export default NoUserModal;
