const followingUsers: any = {};

const getTweetUsername = (tweet: HTMLDivElement): string => {
	const tweetUsernameElement = tweet.querySelector<HTMLDivElement>('[data-testid="User-Name"]');

	if (tweetUsernameElement === null) {
		return "";
	}

	const tweetUsernameLink = tweetUsernameElement.querySelector("a");
	if (tweetUsernameLink === null) {
		return "";
	}

	const tweetUsernameMatch = (tweetUsernameLink.getAttribute("href") ?? "").match(/^\/([A-Za-z0-9_-]+)(|\/.*)$/);

	let tweetUsername = "";
	if (tweetUsernameMatch !== null && tweetUsernameMatch.length > 0) {
		tweetUsername = tweetUsernameMatch[1];
	}

	return tweetUsername;
};

const addFollowStatus = (tweet: HTMLDivElement) => {
	if (tweet.dataset.following === "true" || tweet.dataset.following === "false") {
		return;
	}

	const tweetUsername = getTweetUsername(tweet);

	if (followingUsers[tweetUsername] !== undefined) {
		tweet.dataset.following = followingUsers[tweetUsername];
	}
};

const getFollowStatus = () => {
	// 今表示しているツイートを取得
	const tweets = document.querySelectorAll<HTMLDivElement>('[data-testid="tweet"]');

	for (const tweet of tweets) {
		addFollowStatus(tweet);

		if (tweet.dataset.following === "true" || tweet.dataset.following === "false") {
			continue;
		}

		const menuButton = tweet.querySelector('[data-testid="caret"]');

		if (menuButton === null) {
			continue;
		}

		const clickEvent = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			view: window
		});

		menuButton.dispatchEvent(clickEvent);

		const d =
			"M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm12.586 3l-2.043-2.04 1.414-1.42L20 7.59l2.043-2.05 1.414 1.42L21.414 9l2.043 2.04-1.414 1.42L20 10.41l-2.043 2.05-1.414-1.42L18.586 9zM3.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C13.318 13.65 11.838 13 10 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C5.627 11.85 7.648 11 10 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H1.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46z";

		window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				const dropdowns = document.querySelectorAll<HTMLDivElement>('[data-testid="Dropdown"]');
				for (const dropdown of dropdowns) {
					const followButtonIconPaths = dropdown.querySelectorAll<HTMLAnchorElement>(
						'[role="menuitem"] svg > g > path'
					);

					let following = false;
					for (const followButtonIconPath of followButtonIconPaths) {
						if (d === followButtonIconPath.getAttribute("d")) {
							following = true;
							break;
						}
					}

					const viewEngagementsButton = dropdown.querySelector<HTMLAnchorElement>(
						'[data-testid="tweetEngagements"]'
					);
					if (viewEngagementsButton !== null) {
						const usernameMatch = (viewEngagementsButton.getAttribute("href") ?? "").match(
							/^\/([A-Za-z0-9_-]+)\/.+$/
						);
						let username = "";
						if (usernameMatch !== null && usernameMatch.length > 0) {
							username = usernameMatch[1];
						}

						if (!following) {
							followingUsers[username] = "false";

							break;
						}

						followingUsers[username] = "true";

						const tweets = document.querySelectorAll<HTMLDivElement>('[data-testid="tweet"]');
						for (const tweet of tweets) {
							addFollowStatus(tweet);
						}
					}
				}

				if (menuButton.getAttribute("aria-expanded") === "true") {
					menuButton.dispatchEvent(clickEvent);
				}
			});
		});
	}
};

const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		if (
			mutation.type === "childList" &&
			(mutation.target as HTMLElement).querySelector('[data-testid="tweet"]') === null
		) {
			break;
		}

		getFollowStatus();
	}
});

observer.observe(document.body, { childList: true, subtree: true });

document.body.insertAdjacentHTML(
	"afterbegin",
	/* html */ `
		<style>
			*[data-testid="tweet"][data-following="true"] [data-testid="User-Name"] * {
				color: rgb(29, 155, 240);
			}
		</style>
	`
);
