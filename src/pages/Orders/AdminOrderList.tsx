import React, {useEffect} from 'react';
import {useContext, useDispatch} from "../../context";
import {useService} from "../../services/config/dependencyInjectorConfig";
import AuthService from "../../services/AuthService";
import {performLogout} from "../../helpers/util.functions";

export const AdminOrderList = () => {
    const {userSettings} = useContext();
    const [authService] = useService(AuthService);
    const dispatch = useDispatch();
    const checkIsAdmin = () => {
        if(!authService.isAdmin(userSettings)){
            performLogout(dispatch);
        }
    };

    useEffect(() => {
        checkIsAdmin();
    }, []);

    return (
        <>List Admin Orders - Creat Orders Service + listat orders</>
    );
};

export default AdminOrderList;