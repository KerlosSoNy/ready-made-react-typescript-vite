import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { type AppDispatch, type RootState } from "../redux/store";
import { clearCart } from "../redux/slices/cart";
import { showToast } from "../redux/slices/toast";

import { HttpMethod, useMultiApi } from "./useMultiApi";
import axiosInstance from "../axios/axsionInstance";
import { useNavigate } from "react-router";

export function useCart() {
  // Hooks & Global State
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const Cart = useSelector((state: RootState) => state.cart);
  const Token = useSelector((state: RootState) => state.tokenSlice.token);

  // Local State
  const [choosenAddress, setChoosenAddress] = useState<null | number>(null);
  const [payment_method, setPaymentMethod] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // API Hook
  const { fetchData, returnedData } = useMultiApi();

  // Derived Values
  const total_items = Cart.cart.reduce((total, item) => total + item.quantity, 0);
  // Fetch Addresses & Payment Methods
  useEffect(() => {
    if (Token && Token !== "null") {
      fetchData("addresses", {
        endPoint: "addresses",
        method: HttpMethod.GET,
        withOutToast: true,
      });

      fetchData("payment_methods", {
        endPoint: "payment-methods",
        method: HttpMethod.GET,
        withOutToast: true,
      });
    }
  }, [Token]);
  // Submit Order Handler
  const handleSubmit = () => {
    const hasAddress = choosenAddress !== null;
    const hasItems = Cart?.cart.length > 0;

    if (hasAddress && hasItems && payment_method !== null) {
      // Create new order
      axiosInstance
        .post(
          `/${import.meta.env.VITE_API_APP_TYPE}/${import.meta.env.VITE_API_VERSION}/orders`,
          {
            address_id: choosenAddress,
            payment_method: payment_method,
            coupon_code: null,
            items: Cart?.cart.map((item: any) => ({
              warehouse_stock_id: item.id,
              quantity: item.quantity,
            })),
          }
        )
        .then((res) => {
          dispatch(showToast(t("order_placed_successfully"), "success"));
          dispatch(clearCart());
          navigate(`/successfully-ordered/${res.data.data.id}`);
        })
        .catch((err) => {
          navigate(`/order-failed/${err.data.data.id}`);
        });
    } else {
      // Handle missing fields
      if (!hasAddress) {
        dispatch(showToast(t("please_select_an_address"), "error"));
      }
      if (payment_method === null) {
        dispatch(showToast(t("please_select_a_payment_method"), "error"));
      }
      if (!hasItems) {
        dispatch(showToast(t("your_cart_is_empty"), "error"));
      }
    }
  };

  // Return Hook API
  return {
    Cart,
    total_items,
    Token,
    setIsOpen,
    isOpen,
    returnedData,
    setChoosenAddress,
    choosenAddress,
    setPaymentMethod,
    payment_method,
    dispatch,
    fetchData,
    handleSubmit,
  };
}
