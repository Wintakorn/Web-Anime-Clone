export function getUserReviewTags(userReviews: { rating: number }[]): string[] {
    const oneStarCount = userReviews.filter(r => r.rating === 1).length;
    const fourStarCount = userReviews.filter(r => r.rating === 4).length;
    const fiveStarCount = userReviews.filter(r => r.rating === 5).length;

    const tags: string[] = [];

    if (oneStarCount >= 80) tags.push("พวกเกรียน");
    if (fourStarCount >= 7) tags.push("น่าเชื่อถือ");
    if (fiveStarCount > 10) tags.push("สุดยอดนักรีวิว");
    if (fiveStarCount > 15) tags.push("สุดยอดโอตาคุดีเด่น");

    
    return tags;
}

