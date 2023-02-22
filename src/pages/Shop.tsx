import { useState } from 'react';
import React from 'react';
import { useQuery } from 'react-query';


//Components
import Item from './Item/Item';
import Cart from '../pages/Cart';
import Badge from '@material-ui/core/Badge';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';


//Styles
import { Wrapper, StyledButton } from './Shop.styles';

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
	await (await fetch('https://fakestoreapi.com/products')).json();

const Shop = () => {
	const [cartOpen, setCartOpen] = useState(false);
	const [cartItems, setCartItems] = useState([] as CartItemType[]);
	const { data, isLoading, error } = useQuery<CartItemType[]>(
		'products',
		getProducts
	);
	console.log(data);

	const getTotalItems = (items: CartItemType[]) =>
		items.reduce((ack: number, item) => ack + item.amount, 0);

	const handleAddToCart = (clickedItem: CartItemType) => {
		setCartItems(prev => {
			//Is the item already added in the cart?
			const isItemInCart = prev.find(item => item.id === clickedItem.id);

			if (isItemInCart) {
				return prev.map(item =>
					item.id === clickedItem.id
						? { ...item, amount: item.amount + 1 }
						: item
				);
			}
			//First time the item is added in the cart
			return [...prev, { ...clickedItem, amount: 1 }];
		});
    };

	const handleRemoveFromCart = (id: number) => {
		setCartItems(prev => 
			prev.reduce((ack, item) => {
				if (item.id === id) {
					if (item.amount === 1) return ack;
					return [...ack, { ...item, amount: item.amount - 1 }];
				} else {
					return [...ack, item];
				}
			}, [] as CartItemType[])
		);
    };

	if (isLoading) return <LinearProgress />;
	if (error) return <div>Something went wrong!</div>;

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
			<StyledButton onClick={() => setCartOpen(true)}>
				<Badge badgeContent={getTotalItems(cartItems)} color='error'>
					<AddShoppingCartIcon />
				</Badge>
			</StyledButton>
			<Grid container spacing={3}>
				{data?.map(item => (
					<Grid item key={item.id} xs={12} sm={4} >
						<Item item={item} handleAddToCart={handleAddToCart}/>
					</Grid>
					))}
			</Grid>
		</Wrapper>
		);
};

export default Shop;

