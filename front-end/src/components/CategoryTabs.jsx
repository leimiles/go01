import '../css/CategoryTabs.css'

function CategoryTabs({ categories, selectedCategory, onSelectCategory }) {
    return (
        <div className="category-tabs">
            {categories.map(category => (
                <div
                    key={category.id}
                    className={`category-tab ${selectedCategory?.id === category.id ? 'active' : ''}`}
                    onClick={() => onSelectCategory(category)}
                >
                    {category.name}
                </div>
            ))}
        </div>
    )
}

export default CategoryTabs 