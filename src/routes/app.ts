import { Role } from '../model';
import { CustomerV1 } from './v1/app-customer';
import { SellerV1 } from './v1/app-seller';

export const sellerV1 = new SellerV1(Role.SELLER)
export const customerV1 = new CustomerV1(Role.CUSTOMER)