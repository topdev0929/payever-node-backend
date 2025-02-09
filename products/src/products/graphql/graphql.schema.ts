
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface AlbumInput {
    description?: string;
    icon?: string;
    name: string;
    parent?: string;
}

export interface PaginationInput {
    page?: number;
    limit?: number;
}

export interface GetCategoriesListInput {
    businessId: string;
    name?: string;
}

export interface CategoryAttributeInput {
    name: string;
    isDefault?: boolean;
    type: string;
}

export interface CreateCategoryInput {
    name: string;
    businessId: string;
    parent?: string;
    description?: string;
    slug?: string;
    image?: string;
    attributes?: CategoryAttributeInput[];
}

export interface UpdateCategoryInput {
    name: string;
    businessId: string;
    parent?: string;
    description?: string;
    slug?: string;
    image?: string;
    attributes?: CategoryAttributeInput[];
}

export interface CreateOption {
    name: string;
    type?: string;
    value: string;
}

export interface UpdateOption {
    name: string;
    type?: string;
    value: string;
}

export interface ProductAttributeInput {
    name: string;
    value: string;
    type?: string;
}

export interface VariationAttributeInput {
    name: string;
    type?: string;
}

export interface CategoryInput {
    businessUuid?: string;
    title?: string;
    id?: string;
    slug?: string;
}

export interface ProductInput {
    businessUuid: string;
    images?: string[];
    imagesUrl?: string[];
    videos?: string[];
    videosUrl?: string[];
    title: string;
    brand?: string;
    condition?: string;
    description?: string;
    options?: OptionInput[];
    price: number;
    priceTable?: ProductPriceInput[];
    sale?: ProductSaleInput;
    sku?: string;
    barcode?: string;
    categories?: CategoryInput[];
    category?: string;
    channelSetCategories?: ChannelSetCategoryInput[];
    collections?: string[];
    company?: string;
    channelSets?: ChannelSetInput[];
    type: string;
    active: boolean;
    variants?: VariantInput[];
    recommendations?: RecommendationInput;
    deliveries?: DeliveryInput[];
    shipping?: ShippingInput;
    vatRate?: number;
    country?: string;
    language?: string;
    importedId?: string;
    seo?: ProductSeoInput;
    marketplaces?: ProductMarketplaceInput[];
    attributes?: ProductAttributeInput[];
    variantAttributes?: VariationAttributeInput[];
    ean?: string;
    inventory?: InventoryInput;
}

export interface InventoryInput {
    sku?: string;
    quantity?: number;
    stock?: number;
}

export interface ProductUpdateInput {
    businessUuid?: string;
    id?: string;
    _id?: string;
    images?: string[];
    imagesUrl?: string[];
    videos?: string[];
    videosUrl?: string[];
    title?: string;
    brand?: string;
    condition?: string;
    description?: string;
    price?: number;
    priceTable?: ProductPriceInput[];
    sale?: ProductSaleInput;
    sku?: string;
    barcode?: string;
    categories?: CategoryInput[];
    category?: string;
    channelSetCategories?: ChannelSetCategoryInput[];
    channelSets?: ChannelSetInput[];
    company?: string;
    type?: string;
    active?: boolean;
    variants?: VariantInput[];
    recommendations?: RecommendationInput;
    deliveries?: DeliveryInput[];
    shipping?: ShippingInput;
    vatRate?: number;
    country?: string;
    language?: string;
    seo?: ProductSeoInput;
    marketplaces?: ProductMarketplaceInput[];
    collections?: string[];
    attributes?: ProductAttributeInput[];
    variantAttributes?: VariationAttributeInput[];
    ean?: string;
}

export interface ProductSaleInput {
    onSales?: boolean;
    salePrice?: number;
    salePercent?: number;
    saleEndDate?: string;
    saleStartDate?: string;
}

export interface ChannelSetCategoryInput {
    channelSetId: string;
    categories: CategoryInput[];
    channelSetType: string;
}

export interface ChannelSetInput {
    id?: string;
    type?: string;
    name?: string;
}

export interface OptionInput {
    id?: string;
    name?: string;
    type?: string;
    value?: string;
    extra?: Mixed;
}

export interface VariantInput {
    id?: string;
    barcode?: string;
    description?: string;
    images?: string[];
    options?: OptionInput[];
    attributes?: ProductAttributeInput[];
    price?: number;
    sale?: ProductSaleInput;
    sku?: string;
    priceTable?: ProductPriceInput[];
}

export interface DeliveryInput {
    name: string;
    duration?: number;
    measure_duration?: string;
}

export interface ShippingInput {
    free?: boolean;
    general?: boolean;
    weight: number;
    width: number;
    length: number;
    height: number;
}

export interface ProductSeoInput {
    title?: string;
    description?: string;
}

export interface ProductPriceConditionInput {
    field: string;
    fieldType: string;
    fieldCondition: string;
    value: VariableConditionValueType;
}

export interface ProductPriceInput {
    condition: ProductPriceConditionInput;
    currency: string;
    price: number;
    sale?: ProductSaleInput;
    vatRate?: number;
}

export interface ProductMarketplaceInput {
    id: string;
    activated?: boolean;
    name?: string;
    type?: string;
    connected?: boolean;
}

export interface RecommendationItemInput {
    id?: string;
    images?: string[];
    name?: string;
}

export interface RecommendationInput {
    recommendations?: RecommendationItemInput[];
    tag?: string;
}

export interface ProductFilter {
    field: string;
    fieldType: string;
    fieldCondition?: string;
    value?: string;
    filters?: ProductFilter[];
    valueIn?: string[];
}

export interface CreateVariant {
    barcode?: string;
    description?: string;
    onSales?: boolean;
    images?: string[];
    options?: CreateOption[];
    price?: number;
    salePrice?: number;
    sku?: string;
    attributes?: ProductAttributeInput[];
}

export interface UpdateVariant {
    barcode?: string;
    description?: string;
    onSales?: boolean;
    images?: string[];
    options?: UpdateOption[];
    price?: number;
    salePrice?: number;
    sku?: string;
    attributes?: ProductAttributeInput[];
}

export interface Album {
    id?: string;
    ancestors?: string[];
    businessId?: string;
    description?: string;
    icon?: string;
    name?: string;
    parent?: string;
}

export interface GetAlbumResult {
    result?: Album[];
    totalCount?: number;
}

export interface IQuery {
    getAlbum(businessId: string, pagination?: PaginationInput): Album[] | Promise<Album[]>;
    findAlbumById(albumId: string, businessId: string): Album | Promise<Album>;
    findAlbumByParent(albumId: string, businessId: string, pagination?: PaginationInput): Album[] | Promise<Album[]>;
    findAlbumByAncestor(albumId: string, businessId: string, pagination?: PaginationInput): Album[] | Promise<Album[]>;
    getAlbumForBuilder(filter: string, businessId?: string, order?: string, offset?: number, limit?: number): GetAlbumResult | Promise<GetAlbumResult>;
    getCategory(categoryId: string): Category | Promise<Category>;
    listCategories(dto?: GetCategoriesListInput): Category[] | Promise<Category[]>;
    getCategoriesForBuilder(filter: string, business?: string, order?: string, offset?: number, limit?: number): GetCategoryResult | Promise<GetCategoryResult>;
    getCollectionForBuilder(filter: string, business?: string, order?: string, offset?: number, limit?: number): GetCollectionResult | Promise<GetCollectionResult>;
    getFilter(filter: string): FilterResult | Promise<FilterResult>;
    searchCategoriesForBuilder(business: string, search: string, offset?: number, limit?: number): GetCategoryResult | Promise<GetCategoryResult>;
    searchCollectionForBuilder(business: string, search: string, offset?: number, limit?: number): GetCollectionResult | Promise<GetCollectionResult>;
    getChannelSetByBusiness(businessId: string): ChannelSet[] | Promise<ChannelSet[]>;
    product(id?: string, uuid?: string): Product | Promise<Product>;
    getProductsByIdsOrVariantIds(ids?: string[]): Product[] | Promise<Product[]>;
    getProductsByBusiness(businessUuid?: string): Product[] | Promise<Product[]>;
    getBusiness(businessId: string): Business | Promise<Business>;
    getUsedCategoriesForBuilder(filter: string, business?: string, order?: string, pageNumber?: number, paginationLimit?: number): GetCategoryResult | Promise<GetCategoryResult>;
    getCategoriesByProductsForBuilder(filter: string, business?: string, order?: string, offset?: number, limit?: number): GetCategoryResult | Promise<GetCategoryResult>;
    getBusinessMarketplaces(businessId: string): Marketplace[] | Promise<Marketplace[]>;
    getOptions(): Option[] | Promise<Option[]>;
    getOption(id?: string): Option | Promise<Option>;
    getProductNoAlbum(businessId: string, pagination?: PaginationInput): Products | Promise<Products>;
    getProductByAlbum(albumId?: string, businessId?: string, pagination?: PaginationInput): Products | Promise<Products>;
    getCategories(businessUuid: string, title?: string, pageNumber?: number, paginationLimit?: number): Category[] | Promise<Category[]>;
    getUsedCategories(businessUuid: string): Category[] | Promise<Category[]>;
    getProductCountrySetting(productId: string, country: string): CountrySetting | Promise<CountrySetting>;
    getRecommendations(businessUuid: string, pageNumber?: number, paginationLimit?: number, tagFilter?: string): Recommendation[] | Promise<Recommendation[]>;
    getProductRecommendations(id: string): Recommendation | Promise<Recommendation>;
    getProductTranslation(productId: string, language: string): Translation | Promise<Translation>;
    searchForBuilder(business: string, search: string, offset?: number, limit?: number): GetProductsSearchResult | Promise<GetProductsSearchResult>;
    getProducts(paginationLimit: number, businessUuid?: string, pageNumber?: number, orderBy?: string, withMarketplaces?: boolean, orderDirection?: string, includeIds?: string[], filterById?: string[], search?: string, filters?: ProductFilter[], useNewFiltration?: boolean): Products | Promise<Products>;
    lastProductBusinessUpdatedAt(business: string): LastProductBusinessUpdatedAtResult | Promise<LastProductBusinessUpdatedAtResult>;
    listProductIdsByBusiness(business: string): ListProductIdsByBusinessResult | Promise<ListProductIdsByBusinessResult>;
    getProductsByChannelSet(businessId: string, paginationLimit: number, existInChannelSet?: boolean, channelSetId?: string, pageNumber?: number, orderBy?: string, orderDirection?: string, filterById?: string[], unfilterById?: string[], search?: string, channelSetType?: string, allBusinesses?: boolean, filters?: ProductFilter[]): Products | Promise<Products>;
    getProductsByMarketplace(businessUuid: string, paginationLimit: number, existInChannelSet?: boolean, channelSetId?: string, existInMarketplace?: boolean, marketplaceId?: string, pageNumber?: number, orderBy?: string, orderDirection?: string, filterById?: string[], unfilterById?: string[], search?: string, filters?: ProductFilter[]): Products | Promise<Products>;
    getProductsByCategories(businessUuid: string, categories?: string[], paginationLimit?: number, pageNumber?: number, orderBy?: string, orderDirection?: string): Products | Promise<Products>;
    isSkuUsed(sku: string, businessUuid: string, productId?: string): boolean | Promise<boolean>;
    getVariant(id?: string): Variant | Promise<Variant>;
}

export interface IMutation {
    createAlbum(businessId?: string, album?: AlbumInput): Album | Promise<Album>;
    updateAlbum(albumId?: string, businessId?: string, album?: AlbumInput): Album | Promise<Album>;
    deleteAlbum(albumId?: string, businessId?: string): boolean | Promise<boolean>;
    createAlbumForBuilder(filter: string, businessId: string): Album | Promise<Album>;
    updateAlbumForBuilder(filter: string, businessId: string): Album | Promise<Album>;
    deleteAlbumForBuilder(filter: string, businessId: string): boolean | Promise<boolean>;
    createCategory(dto: CreateCategoryInput, category: CategoryInput): Category | Promise<Category>;
    updateCategory(dto: UpdateCategoryInput, categoryId: string): Category | Promise<Category>;
    deleteCategory(categoryId: string): boolean | Promise<boolean>;
    createOption(data?: CreateOption): Option | Promise<Option>;
    updateOption(id?: string, data?: UpdateOption): Option | Promise<Option>;
    deleteOption(id?: string): Option | Promise<Option>;
    linkProductToAlbum(albumId: string, businessId: string, productId: string): boolean | Promise<boolean>;
    linkProductToAlbumForBuilder(filter: string, business?: string): boolean | Promise<boolean>;
    unlinkProductFromAlbum(businessId: string, productId: string): boolean | Promise<boolean>;
    unlinkProductFromAlbumForBuilder(filter: string, business?: string): boolean | Promise<boolean>;
    createProduct(product?: ProductInput): Product | Promise<Product>;
    copyProducts(businessId: string, productIds: string[], targetCollectionId?: string, targetFolderId?: string, prefix?: string): Products | Promise<Products>;
    updateProduct(product?: ProductUpdateInput): Product | Promise<Product>;
    deleteProduct(ids?: string[]): number | Promise<number>;
    updateProductChannelSets(business?: string, channelSets?: ChannelSetInput[], addToProductIds?: string[], deleteFromProductIds?: string[]): Product | Promise<Product>;
    updateProductsToMarketplaces(marketplaces?: ProductMarketplaceInput[], addToProductIds?: string[], deleteFromProductIds?: string[]): Product | Promise<Product>;
    createVariant(productId?: string, data?: CreateVariant): Variant | Promise<Variant>;
    updateVariant(id?: string, data?: UpdateVariant): Variant | Promise<Variant>;
    deleteVariant(id?: string): Variant | Promise<Variant>;
}

export interface Category {
    _id?: string;
    id?: string;
    businessUuid?: string;
    slug?: string;
    type?: string;
    business?: BusinessReference;
    description?: string;
    parent?: ParentCategory;
    ancestors?: ParentCategory[];
    name?: string;
    image?: string;
    attributes?: CategoryAttribute[];
    inheritedAttributes?: CategoryAttribute[];
    title?: string;
}

export interface Product {
    categories?: Category[];
    channelSets?: ChannelSets[];
    _id?: string;
    uuid?: string;
    hidden?: boolean;
    enabled?: boolean;
    id?: string;
    active?: boolean;
    barcode?: string;
    country?: string;
    currency?: string;
    description?: string;
    images?: string[];
    imageUrls?: string[];
    onSales?: boolean;
    price?: number;
    salePrice?: number;
    sku?: string;
    title?: string;
    type?: string;
    vatRate?: number;
    album?: string;
    businessUuid?: string;
    business?: BusinessDetail;
    channelSetCategories?: ChannelSetCategory[];
    company?: string;
    dropshipping?: boolean;
    imagesUrl?: string[];
    videos?: string[];
    videosUrl?: string[];
    slug?: string;
    brand?: string;
    condition?: string;
    priceTable?: ProductPrice[];
    priceAndCurrency?: string;
    sale?: ProductSale;
    salePriceAndCurrency?: string;
    category?: CategoryReference;
    language?: string;
    importedId?: string;
    variants?: Variant[];
    deliveries?: Delivery[];
    shipping?: Shipping;
    seo?: ProductSeo;
    marketplaces?: ProductMarketplace[];
    apps?: string[];
    attributes?: ProductAttribute[];
    variantAttributes?: VariationAttribute[];
    collections?: Collection[];
    recommendations?: RecommendationItem[];
    stock?: number;
    variantCount?: number;
}

export interface BusinessReference {
    id?: string;
}

export interface CategoryAttribute {
    name?: string;
    type?: string;
}

export interface ParentCategory {
    id?: string;
    business?: BusinessReference;
    description?: string;
    name?: string;
    slug?: string;
    image?: string;
}

export interface GetCategoryResult {
    result?: Category[];
    totalCount?: number;
}

export interface FilterOption {
    label?: string;
    value?: string;
    field?: string;
}

export interface FilterResult {
    result?: Filter[];
    totalCount?: number;
}

export interface Filter {
    field?: string;
    title?: string;
    type?: string;
    options?: FilterOption[];
}

export interface Collection {
    ancestors?: string[];
    id?: string;
    name?: string;
    parent?: string;
    image?: string;
    productCount?: number;
    _id?: string;
    description?: string;
    slug?: string;
}

export interface GetCollectionResult {
    result?: Collection[];
    totalCount?: number;
}

export interface ChannelSet {
    id?: string;
    name?: string;
    type?: string;
    active?: boolean;
    business?: string;
    enabledByDefault?: boolean;
    customPolicy?: boolean;
    policyEnabled?: boolean;
    originalId?: string;
}

export interface ChannelSets {
    id?: string;
    type?: string;
    name?: string;
}

export interface CompanyAddress {
    country?: string;
    city?: string;
    street?: string;
    zipCode?: string;
}

export interface Business {
    id?: string;
    companyAddress?: CompanyAddress;
    currency?: string;
    name?: string;
}

export interface SubscriptionInterface {
    name?: string;
    businessId: string;
    installed?: boolean;
    connected?: boolean;
}

export interface Marketplace {
    _id?: string;
    businessId: string;
    type: string;
    name?: string;
    subscription?: SubscriptionInterface;
}

export interface ProductAttribute {
    name: string;
    value: string;
    type?: string;
}

export interface VariationAttribute {
    name: string;
    type?: string;
}

export interface CategoryReference {
    id?: string;
    title?: string;
    slug?: string;
}

export interface ChannelSetCategory {
    channelSetId: string;
    categories: CategoryReference[];
    channelSetType: string;
}

export interface CountrySetting {
    active?: boolean;
    channelSets?: ChannelSets[];
    currency?: string;
    onSales?: boolean;
    recommendations?: Recommendation;
    price?: number;
    salePrice?: number;
    shipping?: Shipping;
    vatRate?: number;
}

export interface RecommendationItem {
    id?: string;
    images?: string[];
    name?: string;
    sku?: string;
}

export interface Recommendation {
    recommendations?: RecommendationItem[];
    tag?: string;
}

export interface Translation {
    attributes?: ProductAttribute[];
    categories?: Category[];
    category?: CategoryReference;
    collections?: Collection[];
    description?: string;
    images?: string[];
    imagesUrl?: string[];
    title?: string;
    variants?: Variant[];
    variantAttributes?: VariationAttribute[];
    videos?: string[];
    videosUrl?: string[];
}

export interface ProductSearch {
    _id?: string;
    id?: string;
    album?: string;
    businessUuid?: string;
    business?: BusinessDetail;
    currency?: string;
    company?: string;
    images?: string[];
    imagesUrl?: string[];
    matchedText?: string;
    videos?: string[];
    videosUrl?: string[];
    title?: string;
    description?: string;
    onSales?: boolean;
    price?: number;
    priceAndCurrency?: string;
    salePriceAndCurrency?: string;
    salePrice?: number;
    sku?: string;
    barcode?: string;
    categories?: Category[];
    category?: CategoryReference;
    type?: string;
    channelSetCategory?: ChannelSetCategory;
    condition?: string;
    brand?: string;
    channelSets?: ChannelSets[];
    active?: boolean;
    variants?: Variant[];
    shipping?: Shipping;
    seo?: ProductSeo;
    marketplaces?: ProductMarketplace[];
    apps?: string[];
    attributes?: ProductAttribute[];
    variantAttributes?: VariationAttribute[];
    collections?: Collection[];
    recommendations?: RecommendationItem[];
    stock?: number;
    variantCount?: number;
}

export interface GetProductsSearchResult {
    result?: ProductSearch[];
    totalCount?: number;
}

export interface Delivery {
    name: string;
    duration?: number;
    measure_duration?: string;
}

export interface Shipping {
    free?: boolean;
    general?: boolean;
    weight: number;
    width: number;
    length: number;
    height: number;
    measure_mass?: string;
    measure_size?: string;
}

export interface ProductPriceCondition {
    field: string;
    fieldType: string;
    fieldCondition: string;
    value: VariableConditionValueType;
}

export interface ProductSale {
    onSales?: boolean;
    salePrice?: number;
    salePercent?: number;
    saleEndDate?: string;
    saleStartDate?: string;
}

export interface ProductPrice {
    condition?: ProductPriceCondition;
    currency: string;
    price?: number;
    sale?: ProductSale;
    vatRate?: number;
}

export interface ProductMarketplace {
    id: string;
    name: string;
    type: string;
    connected?: boolean;
    activated: boolean;
}

export interface Variant {
    id?: string;
    images?: string[];
    imagesUrl?: string[];
    title?: string;
    description?: string;
    price?: number;
    sale?: ProductSale;
    sku?: string;
    attributes?: ProductAttribute[];
    barcode?: string;
    priceTable?: ProductPrice[];
    _id?: string;
    businessUuid?: string;
    onSales?: boolean;
    options?: Option[];
    salePrice?: number;
    apps?: string[];
    hidden?: boolean;
}

export interface BusinessDetail {
    _id?: string;
    companyAddress?: CompanyAddress;
}

export interface ProductSeo {
    title?: string;
    description?: string;
}

export interface Pagination {
    page?: number;
    page_count?: number;
    per_page?: number;
    item_count?: number;
}

export interface Info {
    pagination?: Pagination;
    isChannelWithExisting?: boolean;
    isMarketplaceWithExisting?: boolean;
}

export interface Products {
    products?: Product[];
    info?: Info;
}

export interface GetProductsResult {
    result?: Product[];
    totalCount?: number;
}

export interface GetProductResult {
    result?: Product;
}

export interface LastProductBusinessUpdatedAtResult {
    result?: string;
}

export interface ListProductIdsByBusinessResult {
    result?: string[];
}

export interface Option {
    _id?: string;
    name?: string;
    type?: string;
    value?: string;
    extra?: Mixed;
}

export type Mixed = any;
export type VariableConditionValueType = any;
