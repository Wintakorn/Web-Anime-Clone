import { Request, Response } from "express";
import { MangaInput, MangaUpdate } from "../types/manga.interface";
import Manga from "../model/Manga";

export const createManga = async (
    req: Request<{}, {}, MangaInput>,
    res: Response
) => {
    try {
        const {
            title,
            synopsis,
            genre,
            image,
            episodes,
            releaseDate,
            status,
            aired,
            broadcast,
            producers,
            licensors,
            studios,
            source,
            demographic,
            rating,
            score,
            ranked,
            popularity,
            favorites,
            mangaSimpleUrl,
            premiered,
            price,
            discountPercent
        } = req.body
        const newManga = new Manga({
            title,
            synopsis,
            genre,
            image,
            episodes,
            releaseDate,
            status,
            aired,
            broadcast,
            producers,
            licensors,
            studios,
            source,
            demographic,
            rating,
            score,
            ranked,
            popularity,
            favorites,
            mangaSimpleUrl,
            premiered,
            price,
            discountPercent
        })
        await newManga.save()
        res.status(201).json({
            message: "Manga created successfully",
            manga: newManga,
        })

    } catch (err: unknown) {
        console.error(err)
        if (err instanceof Error) {
            res.status(500).json({ message: err.message })
        } else {
            res.status(500).json({ message: "Internal server error" })
        }
    }
}

export const getMangas = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = (req.query.search as string) || '';
        const sort = (req.query.sort as string) || 'relevance';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const query = search
            ? { title: { $regex: search, $options: 'i' } }
            : {};

        // ✅ รองรับการจัดเรียงหลายรูปแบบ
        const sortOption: Record<string, any> = (() => {
            switch (sort) {
                case 'latest':
                    return { releaseDate: -1 }; // หรือ createdAt
                case 'price_asc':
                    return { price: 1 };
                case 'price_desc':
                    return { price: -1 };
                case 'popularity':
                    return { popularity: -1 };
                case 'bestseller':
                    return { favorites: -1 };
                default:
                    return { score: -1 }; // relevance หรือคะแนน
            }
        })();

        const total = await Manga.countDocuments(query);

        const mangas = await Manga.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            message: 'Manga fetched successfully',
            mangas,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err: unknown) {
        console.error(err);
        res.status(500).json({
            message: err instanceof Error ? err.message : 'Internal server error',
        });
    }
};


export const getMangaById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const manga = await Manga.findById(id)
        if (!manga) {
            res.status(404).json({ message: "Manga not found" })
        }
        res.status(200).json({
            message: "Manga fetched successfully",
            manga,
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message })
        } else {
            res.status(500).json({ message: "Internal server error" })
        }
    }
}

export const updateManga = async (
    req: Request<{ id: string }, {}, MangaUpdate>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params
        const updatedManga = await Manga.findByIdAndUpdate(
            id, req.body, { new: true }
        )
        if (!updatedManga) {
            res.status(404).json({ message: "Manga not found" })
        }
        res.status(200).json({
            message: "Manga updated successfully",
            manga: updatedManga
        })
    } catch (err: unknown) {
        console.error(err)
        if (err instanceof Error) {
            res.status(500).json({ message: err.message })
        } else {
            res.status(500).json({ message: "Internal server error" })
        }
    }
}

export const deleteManga = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const deletedManga = await Manga.findByIdAndDelete(id)
        if (!deletedManga) {
            res.status(404).json({ message: "Manga not found" })
        }
        res.status(200).json({
            message: "Manga deleted successfully",
            manga: deletedManga
        })
    } catch (err: unknown) {
        console.error(err)
        if (err instanceof Error) {
            res.status(500).json({ message: err.message })
        } else {
            res.status(500).json({ message: "Internal server error" })
        }
    }
}

