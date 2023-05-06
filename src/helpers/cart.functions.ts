import {Product} from "../entities/ProductEntity";
import LocalStorageService from "../services/localStorageService/LocalStorageService";
import {LocalStorageKeys} from "../services/localStorageService/LocalStorageKeys";
import {CartItemType} from "../pages";

export const getProductsFromCart = () => {
    return LocalStorageService.getItem(LocalStorageKeys.cartContent) ? LocalStorageService.getItem(LocalStorageKeys.cartContent) as CartItemType[] : [] as CartItemType[];
};

export const addProductToTheCart = (itemToAdd: Product | CartItemType, amount = 1): void => {
    const addedItemsInCart = getProductsFromCart();
    const isItemInCart = addedItemsInCart.find(item => item._id === itemToAdd._id);

    if (isItemInCart) {
        const cartContent = addedItemsInCart.map(item => item._id === isItemInCart._id ? {...item, amount: item.amount + amount} : item);
        LocalStorageService.setItem(LocalStorageKeys.cartContent, cartContent);
    } else {
        LocalStorageService.setItem(LocalStorageKeys.cartContent, [...addedItemsInCart, {
            ...itemToAdd,
            amount: amount
        }]);
    }
};

export const removeProductFromCart = (productId: string, amountToDelete = 1): void => {
    let addedItemsInCart = getProductsFromCart();
    const isItemInCart = addedItemsInCart.find(item => item._id === productId);
    if(!isItemInCart){
        return;
    }

    if (isItemInCart.amount <= amountToDelete) {
        addedItemsInCart = addedItemsInCart.filter(productInCart => productInCart._id !== productId);
        LocalStorageService.setItem(LocalStorageKeys.cartContent, addedItemsInCart);
    }else{
        const cartContent = addedItemsInCart.map(item => item._id === isItemInCart._id ? {...item, amount: item.amount - amountToDelete} : item);
        LocalStorageService.setItem(LocalStorageKeys.cartContent, cartContent);
    }
};
