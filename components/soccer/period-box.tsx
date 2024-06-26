'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconType } from 'react-icons';
import qs from 'query-string';
import useModal from '@/hooks/use-modal';
import axios from 'axios';
import {
  fetchEPL2122,
  fetchEPL2223,
  fetchEPL2324,
  fetchEPL2425,
} from '@/lib/queries/fixtures';
import useFixturesStore from '@/store/use-fixture-store';

type PeriodBoxProps = {
  label: string;
  value: string;
  description?: string;
  icon: IconType | string;
  selected?: boolean;
  last?: string;
};

type QueryParams = {
  period?: string;
};

const PeriodBox = ({
  label,
  value,
  description,
  icon: Icon,
  selected,
  last,
}: PeriodBoxProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const {
    items,
    item,
    isLoading,
    error,
    setItem,
    setItems,
    setError,
    setIsLoading,
  } = useFixturesStore();

  const { isOpen, setGroup, id } = useModal();

  const handleClick = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: QueryParams = {
      ...currentQuery,
      period: value,
    };
    // if (params.get('period') === value) {
    //   delete updatedQuery.period;
    // }
    const url = qs.stringifyUrl(
      {
        url: '/soccer',
        query: updatedQuery as qs.StringifiableRecord,
      },
      {
        skipNull: true,
      }
    );
    setGroup('new-fixture', isOpen, value, url);
    router.push(url);

    let ignore = false;
    const fetchData = async () => {
      try {
        const period = updatedQuery.period;

        if (!period || !['21-22', '22-23', '23-24', '24-25'].includes(period))
          return null;

        const apiMap = {
          '21-22': fetchEPL2122,
          '22-23': fetchEPL2223,
          '23-24': fetchEPL2324,
          '24-25': fetchEPL2425,
        };

        const fetchFunction = apiMap[period as keyof typeof apiMap];

        if (id) {
          const res = (await fetchFunction(id)) as any;
          if (ignore) return;
          if (!res) return null;
          setItem(res);
        } else if (!id) {
          const res = (await fetchFunction()) as any;
          if (ignore) return;
          if (!res) return null;
          setItems(res);
        }
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching data', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [
    params,
    router,
    value,
    isOpen,
    setGroup,
    id,
    setError,
    setIsLoading,
    setItem,
    setItems,
  ]);

  if (!last) return;
  const lastVal = last;
  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex  flex-row justify-center items-center gap-2 px-4 py-2 hover:text-nowrap  hover:shadow-md  hover:text-gray-800 transition cursor-pointer grayscale hover:grayscale-0',
        selected
          ? ' bg-indigo-50  rounded-sm text-stone-900 text-nowrap border-x-4 even:border-indigo-600 even:text-sky-700 shadow-xl underline decoration-indigo-300 grayscale-0 font-bold odd:border-orange-600 odd:text-amber-900'
          : 'border-transparent text-neutral-400'
      )}
    >
      <Icon
        size={12}
        className='w-5 h-5  hover:grayscale-0 hover:text-sky-600'
      />
      <div className='text-sm font-semibold break-keep'>{label}</div>
      {/* <VerticalDropdown period={period} value={value} /> */}
    </div>
  );
};

export default PeriodBox;
