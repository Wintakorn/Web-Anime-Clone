import { Request, Response } from "express";
import Cart from "../model/Cart";

export const addOrUpdateCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const { mangaId, title, price, coverImage, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const idx = cart.items.findIndex((item) => item.mangaId.equals(mangaId));
    if (idx !== -1) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({ mangaId, title, price, coverImage, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const cart = await Cart.findOne({ userId });
    res.json({ items: cart?.items || [] });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const mangaId = req.params.mangaId;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    for (let i = cart.items.length - 1; i >= 0; i--) {
      if (cart.items[i].mangaId.toString() === req.params.mangaId) {
        cart.items.splice(i, 1);
      }
    }
    await cart.save();
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};


export const updateCartItemQuantity = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { mangaId } = req.params;
  const { quantity } = req.body;

  if (!mangaId || typeof quantity !== 'number') {
    return res.status(400).json({ message: "Missing mangaId or invalid quantity" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(item => item.mangaId.toString() === mangaId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;

    await cart.save();
    return res.json({
      message: "Cart item updated successfully",
      cart: cart,
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
