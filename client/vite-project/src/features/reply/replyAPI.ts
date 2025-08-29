import api from "../../service/api";
import type { IReplys, ReplyInput } from "../../types/reply.t";


export const fetchReplys = (id: string): Promise<IReplys[]> => {
    return api.get(`/replys/${id}`).then(res => res.data.replys)
}

export const createReply = (ReplyData: ReplyInput): Promise<IReplys> => {
    return api.post('/replys/create', ReplyData, {
    }).then(res => res.data.newreply);
}