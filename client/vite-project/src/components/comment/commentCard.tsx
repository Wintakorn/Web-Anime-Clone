// import React from 'react';
// import dayjs from 'dayjs';
// import { MoreHorizontal, SendHorizonal } from 'lucide-react';
// import type { IComment } from '../../types/comment.t';
// import type { IReplys } from '../../types/reply.t';

// interface Props {
//   comment: IComment;
//   replies: IReplys[];
//   replyText: string;
//   onChangeReplyText: (val: string) => void;
//   onReply: () => void;
//   userAvatar: string;
// }

// export default function CommentCard({
//   comment,
//   replies,
//   replyText,
//   onChangeReplyText,
//   onReply,
//   userAvatar
// }: Props) {
//   return (
//     <div className="flex items-start space-x-4 mb-6">
//       <img className="w-10 h-10 rounded-full" src={comment.user.avatar} alt="avatar" />
//       <div className="flex-1">
//         <div className="flex items-center justify-between mb-1">
//           <div className="flex items-center space-x-2">
//             <span className="text-gray-300 font-medium">{comment.user.name}</span>
//             <span className="text-gray-500 text-sm">• {dayjs(comment.createdAt).fromNow()}</span>
//           </div>
//           <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-white" />
//         </div>

//         <p className="text-gray-200">{comment.content}</p>
//         {comment.commentImage && (
//           <img src={comment.commentImage} alt="comment" className="rounded-lg mt-2 max-w-xs" />
//         )}

//         {/* Reply Input */}
//         <div className="mt-4 flex items-start space-x-3">
//           <img className="w-8 h-8 rounded-full" src={userAvatar} alt="your avatar" />
//           <div className="flex-1">
//             <textarea
//               className="w-full bg-[#1e293b] text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring focus:border-blue-400"
//               rows={2}
//               placeholder={`Reply to ${comment.user.name},`}
//               value={replyText}
//               onChange={e => onChangeReplyText(e.target.value)}
//             />
//           </div>
//           <button
//             disabled={!replyText.trim()}
//             onClick={onReply}
//             className={`px-3 py-2 rounded-md ${
//               replyText.trim()
//                 ? 'bg-blue-500 hover:bg-blue-600 text-white'
//                 : 'bg-gray-600 text-gray-300 cursor-not-allowed'
//             }`}
//           >
//             <SendHorizonal size={16} />
//           </button>
//         </div>

//         {/* Replies */}
//         {replies.length > 0 && replies.map(reply => (
//           <div key={reply.id} className="ml-14 mt-2 flex items-start space-x-3">
//             {/* <img className="w-8 h-8 rounded-full" src={reply.user.avatar} alt="avatar" /> */}
//             <div className="bg-gray-800 rounded-lg p-3 w-full">
//               <div className="text-sm text-gray-300 font-medium">{reply.user.name}</div>
//               <div className="text-gray-200">{reply.content}</div>
//               <div className="text-xs text-gray-500">{dayjs(reply.createdAt).fromNow()}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
