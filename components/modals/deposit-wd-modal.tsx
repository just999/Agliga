'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Modal from './modal';
import Heading from '../heading';
import Input from '../ui/input';
import toast from 'react-hot-toast';

import { useRouter } from 'next/navigation';

import useBanks from '@/hooks/use-banks';

import SelectInput from '../select-input';
import useGames from '@/hooks/use-games';

import { GameProps } from '@/types';
import useModal from '@/hooks/use-modal';

import { depoInitialValues, wdInitialValues } from '@/lib/helper';
import { useSession } from 'next-auth/react';
import useCaptchaStore from '@/store/use-captcha-store';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const DepositWdModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, status } = useSession();
  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  const router = useRouter();

  const { getBanks, getByValue } = useBanks();
  const { getGames, getGamesByValue } = useGames();

  const { isLoading: captchaLoading, error, setCaptcha } = useCaptchaStore();
  const { executeRecaptcha } = useGoogleReCaptcha();
  console.log('🚀 ~ DepositWdModal ~ executeRecaptcha:', executeRecaptcha);

  const { modalType, isOpen, onOpen, onClose } = useModal();
  let items;
  if (modalType === 'depo' && session) {
    const email = session.user.curUser.email;
    const bank = session.user.curUser.bank;
    const accountNumber = session.user.curUser.accountNumber;
    const name = session.user.curUser.name;

    items = {
      email,
      bank,
      accountNumber,
      name,
      game: '',
      wdAmount: null,
      gameUserId: '',
    };
  } else if (modalType === 'depo' && !session) {
    items = depoInitialValues;
  } else if (modalType === 'wd') {
    items = wdInitialValues;
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: items,
  });
  const name = watch('name');
  const email = watch('email');
  const bank = watch('bank');
  const game = watch('game');
  const gameUserId = watch('gameUserId');
  const depoAmount = watch('depoAmount');
  const wdAmount = watch('wdAmount');
  const accountNumber = watch('accountNumber');
  const bankPT = watch('bankPT');
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const bankOpt = getBanks();
  const bankOptions = bankOpt.map((bank) => ({
    value: bank.value,
    icon: bank.icon,
  }));

  useEffect(() => {
    const bank = bankOpt.filter(
      (ba) => ba.value === session?.user.curUser.bank
    ) || {
      icon: '',
      value: '',
    };
    if (session) {
      setValue('email', session?.user.curUser.email);
      setValue('bank', bank[0]);
      setValue('name', session?.user.curUser.name);
      setValue('accountNumber', session?.user.curUser.accountNumber);
    }
  }, [bankOpt, session, setValue]);

  // if (!isMounted) return null;
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const gameValues: GameProps = data.game.map((val: any) => val.value);

    let recaptchaToken;
    if (executeRecaptcha) {
      recaptchaToken = executeRecaptcha('inquirySubmit');
    }

    if (modalType === 'depo') {
      data = {
        email,
        accountNumber,
        name,
        depoAmount: +depoAmount,
        bank: bank.value,
        bankPT: bankPT.value,
        gameUserId,
        game: gameValues,
      };
      axios
        .post('/api/depo', data)
        .then((res) => {
          toast.success('Deposit form success di kirim!');
          router.refresh();
          reset();
          onClose();
        })
        .catch((error) => {
          toast.error('Something Went Wrong', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (modalType === 'wd') {
      data = {
        email,
        bank: bank.value,
        accountNumber,
        name,
        game: gameValues,
        wdAmount: +wdAmount,
        gameUserId,
      };
      axios
        .post('/api/wd', data)
        .then(() => {
          toast.success('WD Form Success di kirim!');
          router.refresh();
          reset();
          onClose();
        })
        .catch((error) => {
          toast.error('Something Went Wrong, Error');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleModalTypeChange = (newType: 'depo' | 'wd') => {
    // Reset form values based on the new modal type
    if (newType === 'depo')
      reset({
        ...depoInitialValues,
        // Optionally preserve specific fields like email if needed
        // To keep email field value across modes
      });
    onOpen(newType); // Open the modal with the new type
    if (newType === 'wd')
      reset({
        ...wdInitialValues,
        // Optionally preserve specific fields like email if needed
        // To keep email field value across modes
      });
    onOpen(newType); // Open the modal with the new type
  };

  const gameOpt = getGames();

  const gameOption = gameOpt.map((game) => ({
    value: game.value,
    icon: game.icon,
  }));

  const bankPTOptions = bankOpt.map((bank) => ({
    value: bank.value,
    icon: bank.icon,
  }));

  // const handleCloseClearForm = () => {
  //   onClose();
  //   // items = {
  //   //   name: '',
  //   //   email: '',
  //   //   bank: '',
  //   //   game: '',
  //   //   gameUserId: '',
  //   //   bankPT: '',
  //   //   accountNumber: '',
  //   //   depoAmount: 0,
  //   // };
  //   // setSchedule(initialScheduleValues);
  //   reset();
  // };

  let dynamicLabel;
  if (modalType === 'depo' && depoAmount === '') {
    dynamicLabel = 'depoAmount';
  } else if (modalType === 'wd' && depoAmount === '') {
    dynamicLabel = 'wdAmount';
  } else if (
    (modalType === 'depo' || modalType === 'wd') &&
    depoAmount !== ''
  ) {
    dynamicLabel = '';
  }
  const bodyContent = (
    <div className='flex flex-col gap-2'>
      <Heading title={modalType === 'depo' ? 'Deposit' : 'Wd'} subtitle={''} />
      <Input
        id='email'
        type='email'
        label={email ? '' : 'email'}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {errors.email && (
        <span className='text-sm text-red-500 '>
          <span className=' text-xs underline decoration-rose-300 rounded-lg bg-pink-50 px-4 '>
            Kolom Wajib di isi...
          </span>
        </span>
      )}
      <SelectInput
        label={bank ? '' : 'bank'}
        isMulti={false}
        id='bank'
        value={watch('bank')}
        register={register}
        required
        onChange={(value) => setCustomValue('bank', value)}
        placeholder='Banks'
        options={() => bankOptions}
        errors={errors}
      />
      {errors.bank && (
        <span className='text-sm text-red-500 '>
          <span className=' text-xs underline decoration-rose-300 rounded-lg bg-pink-50 px-4 '>
            Kolom Wajib di isi...
          </span>
        </span>
      )}
      <Input
        id='accountNumber'
        type='tel'
        label={accountNumber ? '' : 'No Rekening'}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {errors.accountNumber && (
        <span className='text-sm text-red-500 '>
          <span className=' text-xs underline decoration-rose-300 rounded-lg bg-pink-50 px-4 '>
            Kolom Wajib di isi...
          </span>
        </span>
      )}

      <Input
        id='name'
        type='text'
        label={name ? '' : 'Nama sesuai dengan rek bank'}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {errors.name && (
        <span className='text-sm text-red-500 '>
          <span className=' text-xs underline decoration-rose-300 rounded-lg bg-pink-50 px-4 '>
            Kolom Wajib di isi...
          </span>
        </span>
      )}
      <Input
        id={modalType === 'depo' ? 'depoAmount' : 'wdAmount'}
        type='number'
        label={
          depoAmount || wdAmount
            ? ''
            : modalType === 'depo'
            ? 'jumlah depo'
            : 'jumlah wd'
        }
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {(errors.depoAmount || errors.wdAmount) && (
        <span className='text-sm text-red-500 '>
          <span className=' text-xs underline decoration-rose-300 rounded-lg bg-pink-50 px-4 '>
            Kolom Wajib di isi...
          </span>
        </span>
      )}

      <SelectInput
        label={game ? '' : 'game'}
        isMulti={false}
        id='game'
        register={register}
        required
        value={game}
        onChange={(value) => setCustomValue('game', value)}
        placeholder='Games'
        options={() => gameOption}
        errors={errors}
      />
      {/* <pre>{JSON.stringify(game, null, 2)}</pre> */}
      {errors.game && (
        <span className='text-sm text-red-500  '>
          <span className=' text-xs underline decoration-rose-300 rounded-lg bg-pink-50 px-4 '>
            Kolom Wajib di isi...
          </span>
        </span>
      )}

      <Input
        id='gameUserId'
        type='text'
        label={gameUserId ? '' : 'user id game'}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {errors.gameUserId && (
        <span className='text-sm text-red-500 '>
          <span className=' text-xs underline decoration-rose-300 rounded-lg bg-pink-50 px-4 '>
            Kolom Wajib di isi...
          </span>
        </span>
      )}

      {modalType === 'depo' && (
        <>
          <SelectInput
            label={bankPT ? '' : 'bankPT'}
            isMulti={false}
            id='bankPT'
            value={bankPT}
            register={register}
            required
            onChange={(value) => setCustomValue('bankPT', value)}
            placeholder='Rekening Tujuan Deposit'
            options={() => bankPTOptions}
            errors={errors}
          />
          {errors.bankPT && (
            <span className='text-sm text-red-500 '>
              <span className=' text-xs underline decoration-rose-300 rounded-lg bg-pink-50 px-4 '>
                Kolom Wajib di isi...
              </span>
            </span>
          )}
        </>
      )}

      <div>Re-captcha</div>
    </div>
  );

  const footerContent = (
    <div className='flex flex-col  m-0 '>
      <hr />

      <div className='text-neutral-500 text-center mt-2 font-light '>
        <div className='justify-center flex flex-row items-center gap-2 '>
          <div>{modalType === 'depo' ? 'Apakah mau Wd?' : 'Mau deposit?'}</div>
          <div
            // onClick={
            //   modalType === 'depo' ? () => onOpen('wd') : () => onOpen('depo')
            // }
            onClick={() =>
              handleModalTypeChange(modalType === 'depo' ? 'wd' : 'depo')
            }
            className='text-neutral-800 cursor-pointer hover:underline '
          >
            {modalType === 'depo' ? 'withdrawal' : ' Deposit'}
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      isOpen={isOpen && (modalType === 'depo' || modalType === 'wd')}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title={modalType === 'depo' ? 'Deposit' : 'Withdrawal'}
      actionLabel='Continue'
      disabled={isLoading}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default DepositWdModal;
