import getCurrentUser from '@/actions/get-user';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// export async function POST(
//   req: Request,
//   { params }: { params: { listingId: string } }
// ) {
//   const currentUser = await getCurrentUser();

//   if (!currentUser) return NextResponse.error();

//   const { listingId } = params;

//   if (!listingId || typeof listingId !== 'string')
//     throw new Error('Invalid listingId');

//   let favoriteIds = [...(currentUser.favoriteIds || [])];

//   favoriteIds.push(listingId);

//   const user = await db.user.update({
//     where: {
//       id: currentUser.id,
//     },
//     data: {
//       favoriteIds,
//     },
//   });

//   return NextResponse.json(user);
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { listingId: string } }
// ) {
//   const currentUser = await getCurrentUser();

//   if (!currentUser) return NextResponse.error();

//   const { listingId } = params;

//   if (!listingId || typeof listingId !== 'string')
//     throw new Error('Invalid listingId');

//   const listing = await db.listing.deleteMany({
//     where: {
//       id: listingId,
//       userId: currentUser.id,
//     },
//   });

//   return NextResponse.json(listing);
// }
