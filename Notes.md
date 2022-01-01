/**
 * Shows a pick list using window.showQuickPick().
 */
export async function showQuickPick() {
	let i = 0;
	let placeHolderText = 'eins, zwei or drei'; 
	const result = await window.showQuickPick([{label: 'eins', description: 'This is one.', detail: 'Hot diggety dog.', folder: 'Poopy'}, {label: 'zwei'}, {label:'drei'}], {
		placeHolder: `${placeHolderText}`,
		onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
	});
	window.showInformationMessage(`Got: ${result?.folder}`);
}

This shows how to dipplay the pick list to the user to get which folder they want.