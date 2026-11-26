import { type SocialComment } from '@/lib/data/types';
import {
    listSocialComments,
    replyToComment,
    toggleCommentHidden,
} from '@/lib/data/social-comments';

export interface SocialCommentService {
    list(): SocialComment[];
    reply(id: string, text: string): void;
    toggleHidden(id: string): void;
}
export const socialCommentService: SocialCommentService = {
    list: listSocialComments,
    reply: replyToComment,
    toggleHidden: toggleCommentHidden,
};
