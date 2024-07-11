class TagManager {
    constructor(containerSelector, tagType) {
        this.tagType = tagType;
        this.tagArray = [];
        this.container = document.querySelector(containerSelector);
        this.container.addEventListener("click", this.handleTagClick.bind(this));
    }

    addTag(value) {
        if (!this.tagArray.includes(value)) {
            this.tagArray.push(value);
            this.renderTag(value);
        }
    }

    renderTag(value) {
        const tagElement = document.createElement("div");
        tagElement.classList.add("tag", this.tagType);
        tagElement.innerHTML = `
            <p>${value}</p>
            <i class="fa-solid fa-xmark delete-x"></i>
        `;
        this.container.appendChild(tagElement);
    }

    handleTagClick(event) {
        if (event.target.classList.contains("delete-x")) {
            const tag = event.target.parentElement;
            const value = tag.querySelector("p").textContent;
            this.removeTag(value);
            tag.remove();
        }
    }

    removeTag(value) {
        this.tagArray = this.tagArray.filter(tagValue => tagValue !== value);
    }

    getTags() {
        return this.tagArray;
    }
}

export default TagManager;