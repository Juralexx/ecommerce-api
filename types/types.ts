import mongoose from 'mongoose';

export interface DefaultUser {
    _id: mongoose.Types.ObjectId;
    name: string;
    lastname: string;
    email: string;
    password: string;
    phone?: string;
}

export interface UserDocument extends mongoose.Model<DefaultUser> {
    login(email: string, password: string): any;
}

export interface Img {
    _id?: mongoose.Types.ObjectId;
    name?: string | null;
    path?: string | null;
    size?: number | null;
    extension?: string | null
}

export type UserRole = 'developer' | 'admin' | 'editor' | 'user';

export interface IUser extends DefaultUser {
    role: UserRole;
    image?: mongoose.Types.ObjectId;
}

export enum Roles {
    developer = 'developer',
    admin = 'admin',
    editor = 'editor',
    user = 'user'
}

export interface ILink {
    id: string | number;
    type?: 'link';
    name: string;
    link: string;
}

export interface ILinks {
    id: string | number;
    type: 'submenu' | 'link';
    name: string;
    link?: string;
    links?: ILink[];
}

export interface INavigation {
    _id?: mongoose.Types.ObjectId;
    navigation?: Array<ILinks>;
}

export interface ICategory {
    _id?: mongoose.Types.ObjectId;
    name: string;
    link: string;
    parent: string;
    content: string;
    image: mongoose.Types.ObjectId;
    promotions: mongoose.Types.ObjectId[];
}

export interface IPage {
    _id?: mongoose.Types.ObjectId;
    published: boolean;
    title: string;
    link: string;
    content: string;
    category: {
        name: string,
        url: string
    };
    image: mongoose.Types.ObjectId;
}

export interface ICustomer extends DefaultUser {
    title: string;
    birth?: Date;
    addresses: IAddress[];
    cart: IProduct[];
    orders: mongoose.Types.ObjectId[];
    registration_date: Date;
}

export interface IProduct {
    _id?: mongoose.Types.ObjectId,
    published?: boolean;
    name: string;
    category: mongoose.Types.ObjectId;
    promotions: mongoose.Types.ObjectId[];
    variants: IProductVariant[];
    base_variant: IProductVariant;
    images?: mongoose.Types.ObjectId[];
    content: string;
    description: string;
    details: Array<{ title: string, content: string }>;
}

export interface IProductVariant {
    _id: mongoose.Types.ObjectId,
    size: string;
    height: string;
    weight: string;
    color: string;
    price: number;
    stock: number;
    promotion: number;
    ref: string;
    taxe: number;
    country: {
        name: string,
        code: string
    };
    url: string;
    barcode: string;
}

export type OrderStatus = 'accepted' | 'preparation' | 'completed' | 'shipped' | 'delivered' | 'canceled';

export type PaymentStatus = 'awaiting' | 'paid' | 'canceled';

export interface IOrder {
    _id: mongoose.Types.ObjectId;
    date: Date;
    payment_method: string;
    delivery_address: IAddress;
    billing_address: IAddress;
    products: {
        product: IProduct;
        variant: IProductVariant;
        original_price: number;
        promotion: number;
        price: number;
        quantity: number;
    }[];
    customer: mongoose.Types.ObjectId;
    shipping_fees: number;
    price: number;
    carrier: string;
    timeline: any[];
    status: OrderStatus;
    payment_status: PaymentStatus;
}

export interface IAddress {
    name: string,
    lastname: string,
    society: string;
    street: string;
    complement: string;
    postcode: string;
    city: string;
    department?: string;
    region?: string;
    phone: string;
}

export interface ICarrier {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    published: boolean;
    delivery_estimate: {
        minimum: number,
        maximum: number
    }
}

export interface IPromotion {
    _id: mongoose.Types.ObjectId;
    type: 'percentage' | 'fixed';
    code: string;
    value: number;
    description: string;
    start_date: Date;
    end_date: Date;
    condition: {
        type: string;
        products?: mongoose.Types.ObjectId[];
        categories?: mongoose.Types.ObjectId[];
    },
    is_active: boolean;
}