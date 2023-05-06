import {useState, useEffect} from 'react';
import React from 'react';
import {useQuery} from 'react-query';
import {useTrackTransactionStatus} from "@multiversx/sdk-dapp/hooks";

//Components
import Item from '../Item/Item';
import Cart from '../Cart';
import Badge from '@material-ui/core/Badge';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';


//Styles
import {Wrapper, StyledButton, CategoryButton} from '../Shop.styles';
import LocalStorageService from '../../services/localStorageService/LocalStorageService';
import {LocalStorageKeys} from '../../services/localStorageService/LocalStorageKeys';
import {Product} from "../../entities/ProductEntity";
import {useService} from "../../services/config/dependencyInjectorConfig";
import ProductsService from "../../services/ProductsService";
import {addProductToTheCart, getProductsFromCart, removeProductFromCart} from "../../helpers/cart.functions";
import {ListGroup} from "react-bootstrap";


//Types
export type CartItemType = {
    _id: string;
    category: string;
    description: string;
    image: string;
    price: number;
    title: string;
    amount: number;
};

export const Shop = () => {
    const [productsService] = useService(ProductsService);

    const [cartOpen, setCartOpen] = useState(false);
	const [filterCategory, setFilterCategory] = useState('');

    const [cartItems, setCartItems] = useState(getProductsFromCart());
    const {data, isLoading, error} = useQuery({
        queryKey: [`getProducts`, filterCategory],
        queryFn: () => productsService.getProducts(filterCategory),
    });

    const transactionStatus = useTrackTransactionStatus({
        transactionId: LocalStorageService.getItem(LocalStorageKeys.txSessionId) ?? "noTx",
    });

    const getTotalItems = (items: CartItemType[]) =>
        items.reduce((ack: number, item) => ack + item.amount, 0);

    const handleAddToCart = (clickedItem: Product | CartItemType) => {
        addProductToTheCart(clickedItem);
        setCartItems(getProductsFromCart());
    };

    const handleRemoveFromCart = (id: string) => {
        removeProductFromCart(id);
        setCartItems(getProductsFromCart);
    };

    const onSuccessTx = () => {
        setCartItems([]);
        LocalStorageService.removeItem(LocalStorageKeys.cartContent);
        LocalStorageService.removeItem(LocalStorageKeys.txSessionId);
    };

    if (LocalStorageService.getItem(LocalStorageKeys.txSessionId) && transactionStatus && transactionStatus.isSuccessful) {
        onSuccessTx();
    }

	const filterByCategory = (category: string) => {
		setFilterCategory(category);
	};

    if (isLoading) return <LinearProgress/>;
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
			<div className="row">
				<StyledButton onClick={() => setCartOpen(true)} className="ml-auto">
					<Badge badgeContent={getTotalItems(cartItems)} color='error'>
						<AddShoppingCartIcon/>
					</Badge>
				</StyledButton>
			</div>

			<div className="row">
				<div className="col-md-2">
					<ListGroup>
						<ListGroup.Item active={filterCategory === ""} className="cursor-pointer"
							onClick={() => filterByCategory('')}
						>All</ListGroup.Item>
						<ListGroup.Item active={filterCategory === "Accessory"} className="cursor-pointer"
							onClick={() => filterByCategory('Accessory')}>Accessory</ListGroup.Item>
						<ListGroup.Item active={filterCategory === "Blouse"} className="cursor-pointer"
							onClick={() => filterByCategory('Blouse')}>Blouses</ListGroup.Item>
						<ListGroup.Item active={filterCategory === "Dress"} className="cursor-pointer"
							onClick={() => filterByCategory('Dress')}>Dresses</ListGroup.Item>
						<ListGroup.Item active={filterCategory === "Jacket"} className="cursor-pointer"
										 onClick={() => filterByCategory('Jacket')}>Jackets</ListGroup.Item>
						<ListGroup.Item active={filterCategory === "Tshirt"} className="cursor-pointer"
										 onClick={() => filterByCategory('Tshirt')}>T-Shirts</ListGroup.Item>

					</ListGroup>
				</div>
				<div className="col-md-10">
					<Grid container spacing={3}>
						{data?.map((item: Product) => (
							<Grid item key={item._id} xs={12} sm={4}>
								<Item item={item} handleAddToCart={handleAddToCart}/>
							</Grid>
						))}
					</Grid>
				</div>
			</div>
        </Wrapper>
    );
};
{/*};*/
}