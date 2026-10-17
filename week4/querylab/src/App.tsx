import { useState } from "react";
import ProductCard from "./components/ProductCard";
import ProductForm from "./components/ProductForm";
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useSearchProductsQuery,
  useUpdateProductMutation,
  type Product,
  type ProductDraft,
} from "./services/productsApi";
import "./App.css";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const normalizedSearch = searchTerm.trim();
  const isSearching = normalizedSearch.length > 0;

  const productsQuery = useGetProductsQuery(undefined, {
    skip: isSearching,
  });
  const searchQuery = useSearchProductsQuery(normalizedSearch, {
    skip: !isSearching,
  });

  const products = isSearching ? searchQuery.data ?? [] : productsQuery.data ?? [];
  const isLoading = isSearching ? searchQuery.isLoading : productsQuery.isLoading;
  const isFetching = isSearching ? searchQuery.isFetching : productsQuery.isFetching;
  const isError = isSearching ? searchQuery.isError : productsQuery.isError;

  const [addProduct, addResult] = useAddProductMutation();
  const [updateProduct, updateResult] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const isSaving = addResult.isLoading || updateResult.isLoading;

  const categories = new Set(products.map((product) => product.category)).size;
  const lowStockCount = products.filter((product) => product.stock <= 8).length;

  function openAddForm() {
    setEditingProduct(undefined);
    setActionError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setActionError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  }

  async function handleSaveProduct(draft: ProductDraft) {
    setActionError(null);
    setSuccessMessage(null);

    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, ...draft }).unwrap();
        setSuccessMessage(`${draft.title} was updated successfully.`);
      } else {
        await addProduct(draft).unwrap();
        setSuccessMessage(`${draft.title} was added to the catalog.`);
      }

      setIsFormOpen(false);
      setEditingProduct(undefined);
    } catch {
      setActionError("The product could not be saved. Check that the API server is running and try again.");
    }
  }

  async function handleDeleteProduct(product: Product) {
    const confirmed = window.confirm(`Delete “${product.title}” from the catalog?`);
    if (!confirmed) return;

    setActionError(null);
    setSuccessMessage(null);
    setDeletingId(product.id);

    try {
      await deleteProduct(product.id).unwrap();
      setSuccessMessage(`${product.title} was removed from the catalog.`);
    } catch {
      setActionError("The product could not be deleted. Check that the API server is running and try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleRefresh() {
    if (isSearching) {
      void searchQuery.refetch();
    } else {
      void productsQuery.refetch();
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="QueryLab home">
          <span className="brand-mark">Q</span>
          <span className="brand-copy">
            <strong>querylab<span>.</span></strong>
            <small>DATA WORKSHOP / DAY 20</small>
          </span>
        </a>

        <div className="topbar-actions">
          <span className="connection-pill"><span className="status-dot" /> LOCAL API</span>
          <button className="button-primary top-add-button" onClick={openAddForm}>
            <span aria-hidden="true">＋</span> Add product
          </button>
        </div>
      </header>

      <main id="top" className="page-content">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">YOUR API PLAYGROUND</p>
            <h1>Explore products.<br /><span>Keep data in sync.</span></h1>
            <p className="hero-description">
              A hands-on playground for fetching, caching, and updating data with RTK Query.
              Every edit is a real request to your local mock API.
            </p>
            <div className="hero-actions-row">
              <button className="button-primary" onClick={openAddForm}>＋ New product</button>
              <span className="hero-caption"><span className="tiny-check">✓</span> Changes persist in db.json</span>
            </div>
          </div>
          <div className="cache-visual" aria-label="RTK Query cache status illustration">
            <div className="cache-orbit orbit-one" />
            <div className="cache-orbit orbit-two" />
            <div className="cache-center">
              <span className="cache-center-icon">↻</span>
              <strong>RTK</strong>
              <small>QUERY CACHE</small>
            </div>
            <span className="orbit-node node-top">GET</span>
            <span className="orbit-node node-right">POST</span>
            <span className="orbit-node node-bottom">TAGS</span>
            <span className="orbit-node node-left">PATCH</span>
          </div>
          <div className="hero-footnote"><span className="hero-line" /> BUILT TO LEARN BY DOING</div>
        </section>

        <section className="stats-row" aria-label="Catalog statistics">
          <article className="stat-card">
            <span className="stat-icon lavender">▦</span>
            <div><span className="stat-label">PRODUCTS SHOWN</span><strong>{products.length}</strong><small>{isSearching ? "matching your search" : "in the current catalog"}</small></div>
          </article>
          <article className="stat-card">
            <span className="stat-icon mint">◈</span>
            <div><span className="stat-label">CATEGORIES</span><strong>{categories}</strong><small>represented in results</small></div>
          </article>
          <article className="stat-card">
            <span className="stat-icon peach">!</span>
            <div><span className="stat-label">LOW STOCK</span><strong>{lowStockCount}</strong><small>8 units or fewer</small></div>
          </article>
          <article className="stat-card cache-stat">
            <span className="stat-icon blue">↻</span>
            <div><span className="stat-label">QUERY STATUS</span><strong className="status-word">{isFetching ? "Fetching" : isError ? "Error" : isLoading ? "Loading" : "Cached"}</strong><small>{isFetching ? "request in progress" : "30s unused cache window"}</small></div>
          </article>
        </section>

        <section className="catalog-section">
          <div className="catalog-header">
            <div>
              <p className="eyebrow">THE COLLECTION</p>
              <h2>Product catalog <span className="catalog-count">{products.length}</span></h2>
              <p className="section-subtitle">Search items, adjust details, or try a mutation.</p>
            </div>
            <div className="catalog-controls">
              <label className="search-box">
                <span className="search-symbol" aria-hidden="true">⌕</span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                />
                {searchTerm && <button type="button" className="clear-search" onClick={() => setSearchTerm("")} aria-label="Clear search">×</button>}
              </label>
              <button className="button-secondary refresh-button" onClick={handleRefresh} disabled={isFetching}>
                <span className={isFetching ? "refresh-spin" : ""}>↻</span> {isFetching ? "Refreshing" : "Refresh"}
              </button>
            </div>
          </div>

          {actionError && <div className="notice notice-error" role="alert"><span>!</span><p>{actionError}</p><button onClick={() => setActionError(null)} aria-label="Dismiss error">×</button></div>}
          {successMessage && <div className="notice notice-success" role="status"><span>✓</span><p>{successMessage}</p><button onClick={() => setSuccessMessage(null)} aria-label="Dismiss message">×</button></div>}

          {isLoading ? (
            <div className="product-grid">
              {Array.from({ length: 6 }, (_, index) => <div className="product-skeleton" key={index}><div /><span /><span /><span /></div>)}
            </div>
          ) : isError ? (
            <div className="state-panel">
              <span className="state-emoji">⌁</span>
              <h3>We couldn't reach the catalog.</h3>
              <p>Make sure the local API is running with <code>npm run server</code>, then try again.</p>
              <button className="button-primary" onClick={handleRefresh}>Try again</button>
            </div>
          ) : products.length === 0 ? (
            <div className="state-panel">
              <span className="state-emoji">⌕</span>
              <h3>{isSearching ? "No products found" : "Your catalog is empty"}</h3>
              <p>{isSearching ? "Try another search term, or clear your search to see everything." : "Add your first product to get started."}</p>
              {isSearching ? <button className="button-secondary" onClick={() => setSearchTerm("")}>Clear search</button> : <button className="button-primary" onClick={openAddForm}>Add a product</button>}
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={openEditForm}
                  onDelete={handleDeleteProduct}
                  isDeleting={deletingId === product.id}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="app-footer">
          <div className="footer-brand"><span className="footer-dot">Q</span><span>querylab<span className="brand-period">.</span></span></div>
          <p>Learning the request. Understanding the cache.</p>
          <span className="footer-tech">REACT · TYPESCRIPT · RTK QUERY</span>
        </footer>
      </main>

      {isFormOpen && (
        <ProductForm
          key={editingProduct?.id ?? "new-product"}
          initialProduct={editingProduct}
          isSaving={isSaving}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProduct(undefined);
          }}
          onSubmit={handleSaveProduct}
        />
      )}
    </div>
  );
}
