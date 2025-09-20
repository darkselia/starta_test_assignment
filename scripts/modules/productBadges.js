const badgeTemplate = document.getElementById('badge-template');

export function createBadge(text, bageModifier) {
    const badge = badgeTemplate.content.cloneNode(true);
    const badgeElement = badge.querySelector('.badge');
    badgeElement.textContent = text;
    badgeElement.classList.add('badge--' + bageModifier);
    return badge;
}
