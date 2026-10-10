const PageHeader = ({ title, description, eyebrow = 'Fresh Farm', parent }) => <section className="page-intro"><div className="section-shell">
  <nav aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true"> / </span>{parent && <><a href={parent.href}>{parent.name}</a><span aria-hidden="true"> / </span></>}<span>{title}</span></nav>
  <p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}
</div></section>
export default PageHeader
