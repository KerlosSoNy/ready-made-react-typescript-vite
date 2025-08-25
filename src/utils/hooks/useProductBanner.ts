import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../utils/redux/store';
import { decreaseCount, increaseCount } from '../../utils/redux/slices/cart';
import type { AttributeOption, ProductResponse } from '../../types';
import axiosInstance from '../../utils/axios/axsionInstance';
import { showToast } from '../../utils/redux/slices/toast';

interface UseProductBannerProps {
    product: ProductResponse;
    setSelectedProduct?: any;
    setMainProduct?: any;
    selectedProduct?: any;
}

export const useProductBanner = ({ product, setSelectedProduct, selectedProduct,setMainProduct }: UseProductBannerProps) => {
    const { t, i18n } = useTranslation("", { keyPrefix: "product_details" });

    // State for Selected Color and Size
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedFit, setSelectedFit] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: any) => state.cart.cart);
    const Token = useSelector((state: RootState) => state?.tokenSlice.token);

    // State for Favorite and Count
    const [count, setCount] = useState(0);
    const [totalCards, setTotalCards] = useState(0);

    // Define The Options
    const [sizes, setSizes] = useState<AttributeOption[]>([]);
    const [colors, setColors] = useState<AttributeOption[]>([]);
    const [mainFits, setMainFits] = useState<AttributeOption[]>([]);

    // Define Available Sizes and Colors
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const [availableColors, setAvailableColors] = useState<string[]>([]);
    const [availableFits, setAvailableFits] = useState<string[]>([]);

    const [primarySelector, setPrimarySelector] = useState<'color' | 'size' | null>(null);
    const [isPrimarySelected, setIsPrimarySelected] = useState(false);

    // Initialize attributes
    useEffect(() => {
        setSizes(product?.attributes?.find((attr: any) => attr.slug === 'size')?.options || []);
        setMainFits(product?.attributes?.find((attr: any) => attr.slug === 'fit')?.options || []);
        setColors(product?.attributes?.find((attr: any) => attr.slug === 'color')?.options || []);
    }, [product]);

    // Handle Selection Functions
    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
    };

    const handleSelectFit = (fit: string) => {
        setSelectedFit(fit);
    };

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
    };
    // Cart operations
    const handleDecrement = () => {
        if (count > 1) {
            setCount(count - 1);
            dispatch(decreaseCount({
                main_id: product?.id || 1,
                id: selectedProduct?.id || 1,
                quantity: count,
                category:product?.category?.name|| '',
                price: selectedProduct?.price?.current_price,
                name: product?.name,
                currency: selectedProduct?.price?.currency_symbol,
                image: selectedProduct?.product_variant?.featured_thumb_image_url || '',
                color: selectedColor,
                fit: selectedFit,
                size: selectedSize,
                discount: selectedProduct?.price?.has_discount ? selectedProduct?.price?.price : null,
                isNew: false,
                isSpecial: false,
                market_name: product?.market?.name|| '', 
                market_logo: product?.market?.logo_thumb || '',
            }));
        }
    };
    const handleIncrement = () => {
        dispatch(increaseCount({
            main_id: product?.id || 1,
            id: selectedProduct?.id || 1,
            quantity: count,
            price: selectedProduct?.price?.current_price,
            name: product?.name,
            category:product?.category?.name|| '',
            currency: selectedProduct?.price?.currency_symbol,
            image: selectedProduct?.product_variant?.featured_thumb_image_url || '',
            color: selectedColor,
            size: selectedSize,
            fit: selectedFit,
            discount: selectedProduct?.price?.has_discount ? selectedProduct?.price?.price : null,
            isNew: false,
            isSpecial: false,
            market_name: product?.market?.name|| '', 
            market_logo: product?.market?.logo_thumb || '',
        }));
        setCount(count + 1);
    };

    // Favorite functionality
    const handleFavorite = async (id: number) => {
        await axiosInstance.post(`/${import.meta.env.VITE_API_APP_TYPE}/${import.meta.env.VITE_API_VERSION}/favorites`, {
            object_id: id,
            object_type: 'SupplierProduct'
        }).then(() => {
            setSelectedProduct((prevProduct: any) => ({
                ...prevProduct,
                supplier_product:{
                    ...prevProduct.supplier_product,
                    is_favorite: !prevProduct.supplier_product.is_favorite
                }
            }))
            setMainProduct((prevProduct: any) => ({
                ...prevProduct,
                warehouse_stocks: prevProduct.warehouse_stocks.map((stock: any) =>{
                    if(stock?.id === selectedProduct?.id){
                        return({
                            ...stock,
                            supplier_product: {
                                ...stock.supplier_product,
                                is_favorite: !stock.supplier_product.is_favorite
                            }
                        })
                    }else{
                        return stock
                    }
                })
            }))
        });
    };
// selectedProduct?.supplier_product?.is_favorite
    const handleFavoriteClick = () => {
        if (Token) {
            handleFavorite(+(selectedProduct?.supplier_product_id));
        } else {
            dispatch(showToast(t(`login_first`), 'error'));
        }
    };

    // Calculate total cards
    useEffect(() => {
        const total = cart.reduce((acc: number, item: any) => {
            if (item.main_id === product?.id) {
                return acc + item.quantity * item?.price;
            }
            return acc;
        }, 0);
        setTotalCards(total);
    }, [cart, product?.id]);

    // Update count based on cart
    useEffect(() => {
        const cartItem = cart.find((item: any) => 
            item.id === selectedProduct?.id && 
            item.color === selectedColor && 
            item.size === selectedSize
        );
        if (cartItem) {
            setCount(cartItem.quantity || 0);
        } else {
            setCount(0);
        }
    }, [cart, selectedColor, selectedSize, selectedProduct]);

    // Determine primary selector
    useEffect(() => {
        if (colors?.length > 0 || sizes?.length > 0) {
            if (colors.length > sizes.length) {
                setPrimarySelector('color');
            } else if (sizes.length > colors.length) {
                setPrimarySelector('size');
            } else {
                setPrimarySelector('color');
            }
        }
    }, [colors, sizes]);

    // Check if primary is selected
    useEffect(() => {
        if (primarySelector === 'color') {
            setIsPrimarySelected(!!selectedColor);
        } else if (primarySelector === 'size') {
            setIsPrimarySelected(!!selectedSize);
        }
    }, [selectedColor, selectedSize, primarySelector]);

    // Handle variant selection and available options
    useEffect(() => {
        setSelectedFit(null);

        if ((primarySelector === 'color' && selectedColor) || (primarySelector === 'size' && selectedSize)) {
            const variants_of_product = product?.warehouse_stocks?.filter((item: any) => {
                return item?.product_variant?.variant_attributes?.some(
                    (variant: any) => primarySelector === 'color' ?
                        variant?.value === selectedColor :
                        variant?.value === selectedSize
                ) && (!selectedSize || item?.product_variant?.variant_attributes?.some(
                    (variant: any) => variant?.value === selectedSize
                )) && (!selectedColor || item?.product_variant?.variant_attributes?.some(
                    (variant: any) => variant?.value === selectedColor
                ));
            });
            setSelectedProduct?.(variants_of_product?.[0] || null);

            // Update available options for secondary selector
            if (primarySelector === 'color' && selectedColor) {
                const availableSizesFromVariants = variants_of_product
                    .flatMap(item => item?.product_variant?.variant_attributes || [])
                    .filter(attr => sizes.some(size => size.value === attr.value))
                    .map(attr => attr.value);
                setAvailableSizes([...new Set(availableSizesFromVariants)]);
            } else if (primarySelector === 'size' && selectedSize) {
                const availableColorsFromVariants = variants_of_product
                    .flatMap(item => item?.product_variant?.variant_attributes || [])
                    .filter(attr => colors.some(color => color.value === attr.value))
                    .map(attr => attr.value);
                setAvailableColors([...new Set(availableColorsFromVariants)]);
            }
        }
    }, [selectedSize, selectedColor, primarySelector, product?.warehouse_stocks, sizes, colors, setSelectedProduct]);

    // Handle fits
    useEffect(() => {
        if (selectedProduct) {
            const newFits: any = mainFits?.filter((item: any) =>
                selectedProduct?.product_variant?.variant_attributes?.some(
                    (variant: any) => variant?.value === item.value
                ));
            setAvailableFits(newFits);
            if (newFits?.length === 1) {
                setSelectedFit(newFits[0].value);
            }
        }
    }, [selectedProduct, mainFits]);

    return {
        // State
        selectedColor,
        selectedSize,
        selectedFit,
        count,
        totalCards,
        sizes,
        colors,
        mainFits,
        availableSizes,
        availableColors,
        availableFits,
        primarySelector,
        isPrimarySelected,
        
        // Handlers
        handleSizeSelect,
        handleSelectFit,
        handleColorSelect,
        handleDecrement,
        handleIncrement,
        handleFavoriteClick,
        
        // Utils
        t,
        i18n
    };
};