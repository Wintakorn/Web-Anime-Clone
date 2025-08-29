import { useEffect, useState } from "react";
import { fetchCart, removeCartItem, updateCartItem } from "../../features/cartAPI";
import api from "../../service/api";
import toast from "react-hot-toast";

type CartItem = {
  mangaId: string;
  title: string;
  price: number;
  coverImage: string;
  quantity: number;
};

const CartPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    fetchCart()
      .then((data) => {
        setCart(data);
        console.log("Cart data:", data);
      })
      .catch((err) => console.error("โหลดตะกร้าล้มเหลว:", err));
  }, []);

  const removeItem = async (mangaId: string) => {
    try {
      await removeCartItem(mangaId);
      setCart(cart.filter(item => item.mangaId !== mangaId));
    } catch (err) {
      toast.error("ลบสินค้าไม่สำเร็จ");
      console.error(err);
    }
  };
  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = async (mangaId: string, quantity: number) => {
    try {
      await updateCartItem(mangaId, quantity);
      setCart(cart.map(item =>
        item.mangaId === mangaId ? { ...item, quantity } : item
      ));
    } catch (err) {
      toast.error("ไม่สามารถอัปเดตจำนวนได้");
      console.error(err);
    }
  };



  return (
    <div className="max-w-6xl mx-auto px-4 my-10">
      <h1 className="text-2xl font-bold text-white mb-6">🛒 ตะกร้าสินค้า</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500 bg-blue-50 py-10 rounded">
          ไม่มีรายการสินค้า
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">สินค้า</th>
                  <th className="p-3">ราคาต่อหน่วย</th>
                  <th className="p-3">จำนวน</th>
                  <th className="p-3">ราคารวม</th>
                  <th className="p-3">ลบ</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.mangaId} className="border-t">
                    <td className="p-3 flex items-center gap-3">
                      <img src={item.coverImage} className="w-14 h-20 object-cover rounded" />
                      <span>{item.title}</span>
                    </td>
                    <td className="p-3">฿{item.price}</td>
                    <td className="p-3">
                      <select
                        className="border rounded px-2"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.mangaId, Number(e.target.value))
                        }
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">฿{item.price * item.quantity}</td>
                    <td className="p-3">
                      <button
                        onClick={() => removeItem(item.mangaId)}
                        className="text-red-500 hover:underline"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* สรุปรายการ */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between border-t pt-3">
            <div className="text-sm text-gray-300">
              <p>ซื้อขั้นต่ำ 600 บาทขึ้นไป ส่งฟรี</p>
              <p>สินค้า Pre-order อาจแยกส่ง</p>
            </div>
            <div className="text-right space-y-2 mt-4 sm:mt-0">
              <p>รวมทั้งหมด: <span className="font-bold">฿{getTotal().toFixed(2)}</span></p>
              <p>ประหยัด: ฿0.00</p>
              <p>ส่วนลด: ฿0.00</p>
              <p className="text-lg font-semibold text-blue-700">ราคาสุทธิ: ฿{getTotal().toFixed(2)}</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                ดำเนินการชำระเงิน
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
