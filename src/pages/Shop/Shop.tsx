import { useState, useEffect } from 'react';
import React from 'react';
import { useQuery } from 'react-query';
import { useTrackTransactionStatus } from "@multiversx/sdk-dapp/hooks";

//Components
import Item from '../Item/Item';
import Cart from '../Cart';
import Badge from '@material-ui/core/Badge';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';


//Styles
import {Wrapper, StyledButton} from '../Shop.styles';
import LocalStorageService from '../../services/localStorageService/LocalStorageService';
import { LocalStorageKeys } from '../../services/localStorageService/LocalStorageKeys';


//Types
export type CartItemType = {
	id: number;
	category: string;
	description: string;
	image: string;
	price: number;
	title: string;
	amount: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
	await (await fetch('http://localhost:5001/api/product')).json();



export const Shop = () => {
	const [cartOpen, setCartOpen] = useState(false);
	const [cartItems, setCartItems] = useState(LocalStorageService.getItem(LocalStorageKeys.cartContent) ? LocalStorageService.getItem(LocalStorageKeys.cartContent) as CartItemType[] : [] as CartItemType[]);
	const {data, isLoading, error} = useQuery<CartItemType[]>(
		'products',
		getProducts
	);

	const transactionStatus = useTrackTransactionStatus({
		transactionId: LocalStorageService.getItem(LocalStorageKeys.txSessionId) ?? "noTx",
	});

	const getTotalItems = (items: CartItemType[]) =>
		items.reduce((ack: number, item) => ack + item.amount, 0);

	const handleAddToCart = (clickedItem: CartItemType) => {
		setCartItems(prev => {
			//Is the item already added in the cart?
			const isItemInCart = prev.find(item => item.id === clickedItem.id);

			if (isItemInCart) {
				return prev.map(item =>
					item.id === clickedItem.id
						? {...item, amount: item.amount + 1}
						: item
				);
			}
			//First time the item is added in the cart
			return [...prev, {...clickedItem, amount: 1}];
		});

		addItemToLocalStorage(clickedItem);
	};

	const addItemToLocalStorage = (clickedItem: CartItemType) => {
		const addedItemsInCart = LocalStorageService.getItem(LocalStorageKeys.cartContent) ? LocalStorageService.getItem(LocalStorageKeys.cartContent) as CartItemType[] : [] as CartItemType[];
		const isItemInCart = addedItemsInCart.find(item => item.id === clickedItem.id);

		if (isItemInCart) {
			LocalStorageService.setItem(LocalStorageKeys.cartContent, addedItemsInCart.map(item =>
				item.id === clickedItem.id
					? {...item, amount: item.amount + 1}
					: item
			));
		} else {
			LocalStorageService.setItem(LocalStorageKeys.cartContent, [...addedItemsInCart, {
				...clickedItem,
				amount: 1
			}]);
		}
	};

	const handleRemoveFromCart = (id: number) => {
		setCartItems(prev =>
			prev.reduce((ack, item) => {
				if (item.id === id) {
					if (item.amount === 1) return ack;
					return [...ack, {...item, amount: item.amount - 1}];
				} else {
					return [...ack, item];
				}
			}, [] as CartItemType[])
		);

		removeItemFromLocalStorage(id);
	};

	const removeItemFromLocalStorage = (id: number) => {
		const addedItemsInCart = LocalStorageService.getItem(LocalStorageKeys.cartContent) ? LocalStorageService.getItem(LocalStorageKeys.cartContent) as CartItemType[] : [] as CartItemType[];

		LocalStorageService.setItem(LocalStorageKeys.cartContent, addedItemsInCart.reduce((ack, item) => {
			if (item.id === id) {
				if (item.amount === 1) return ack;
				return [...ack, {...item, amount: item.amount - 1}];
			} else {
				return [...ack, item];
			}
		}, [] as CartItemType[]));
	};

	const onSuccessTx = () => {
		setCartItems([]);
		LocalStorageService.removeItem(LocalStorageKeys.cartContent);
		LocalStorageService.removeItem(LocalStorageKeys.txSessionId);
	};

	if (LocalStorageService.getItem(LocalStorageKeys.txSessionId) && transactionStatus && transactionStatus.isSuccessful) {
		onSuccessTx();
	}

	if (isLoading) return <LinearProgress/>;
	if (error) return <div>Something went wrong!</div>;

	/*const CategoryProducts = () => {
		const [products, setProducts] = useState<CartItemType[]>([]);
		const [category, setCategory] = useState('');

		useEffect(() => {
			const fetchProducts = async () => {
				const response = await fetch('http://localhost:5001/api/product');
				const data1 = await response.json();
				setProducts(data1);
			};
			fetchProducts();
		}, []);

		const filteredProducts = category ? products.filter(product => product.category === category) : products;*/


		return (
			<Wrapper>
				<Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
					<Cart
						cartItems={cartItems}
						addToCart={handleAddToCart}
						removeFromCart={handleRemoveFromCart}
						buyItems={[]}
					/>
				</Drawer>
				{/*<CategoryButton onClick={() => setCategory('')}>All</CategoryButton>
				<CategoryButton onClick={() => setCategory('Accessory')}>Accessory</CategoryButton>
				<CategoryButton onClick={() => setCategory('Blouse')}>Blouses</CategoryButton>
				<CategoryButton onClick={() => setCategory('Dress')}>Dresses</CategoryButton>
				<CategoryButton onClick={() => setCategory('Jacket')}>Jackets</CategoryButton>
				<CategoryButton onClick={() => setCategory('Tshirt')}>T-Shirts</CategoryButton>
				{filteredProducts.map(product => (
					<div key={product.id}>
						<h2>{product.description}</h2>
						<p>{product.title}</p>
						<p>{product.price}</p>
						<p>{product.category}</p>
					</div>
				))}*/}

				<StyledButton onClick={() => setCartOpen(true)}>
					<Badge badgeContent={getTotalItems(cartItems)} color='error'>
						<AddShoppingCartIcon/>
					</Badge>
				</StyledButton>
				<Grid container spacing={3}>
					{data?.map(item => (
						<Grid item key={item.id} xs={12} sm={4}>
							<Item item={item} handleAddToCart={handleAddToCart}/>
						</Grid>
					))}
				</Grid>
			</Wrapper>
		);
	};
{/*};*/}