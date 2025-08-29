import { Request, Response } from "express";
import User from "../model/User";
import { LoginInput, UserRegisterInput, Usertype, UserUpdateInput } from "../types/userType";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import cloudinary from "../utils/cloudinary";
import Manga from "../model/Manga";


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';



export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const getAllUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            message: "Users fetched successfully",
            users: users,
        });
    } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const getUserById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            message: "User fetched successfully",
            user: user,
        });
    } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const registerUser = async (
    req: Request<{}, {}, UserRegisterInput>,
    res: Response
): Promise<void> => {
    try {
        const { username, password, email } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            res.status(400).json({
                message: "Username already exists",
            });
            return;
        }

        const newpassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: newpassword,
            email,
        });
        await user.save();
        res.status(201).json({
            message: "User created successfully",
            user: user,
        });
    } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const loginUser = async (
    req: Request<{}, {}, LoginInput>,
    res: Response
): Promise<void> => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            res.status(400).json({ message: 'Invalid username or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid username or password' });
            return;
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.status(200).json({
            message: 'Login successful',
            token,
            role: user.role,
            username: user.username,
        });
    } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const deleteUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const updateUser = async (
    req: Request<{ id: string }, {}, UserUpdateInput>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body }
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password');
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            message: "User updated successfully",
            user: user,
        });
    } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const toggleFavorite = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        const mangaId = req.params.id; 

        if (!mangaId) {
            return res.status(400).json({ message: 'mangaId is required' });
        }

        const user = await User.findById(userId);
        const manga = await Manga.findById(mangaId);
        if (!user || !manga) {
            return res.status(404).json({ message: 'User or Manga not found' });
        }

        const isFavorited = user.favorites.includes(manga._id);

        if (isFavorited) {
            user.favorites = user.favorites.filter(id => id.toString() !== mangaId);
        } else {
            user.favorites.push(manga._id);
        }

        await user.save();

        res.json({
            message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
            favorites: user.favorites,
        });
    } catch (err) {
        res.status(500).json({
            message: err instanceof Error ? err.message : 'Internal Server Error',
        });
    }
};

export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).populate('favorites'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Internal Server Error',
    });
  }
};

export const updateProfileImage = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'profile_images' },
                (error, result) => {
                    if (result) resolve(result as { secure_url: string });
                    else reject(error);
                }
            );

            stream.end(file.buffer);
        });

        user.profileImage = result.secure_url;
        await user.save();

        res.json({ message: 'Upload success', profileImage: user.profileImage, });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};
