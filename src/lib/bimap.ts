type ViableKey = string | number

/**
 * A map that keeps a bi-directional association of values
 */
export default class BiMap<K extends ViableKey> {
	private ls: Set<K> = new Set()
	private rs: Set<K> = new Set()
	private map: Map<K, K> = new Map()

	/**
	 * Associates two values in this BiMap.
	 * It assumes that both values have no association within the map,
	 * and will override any association that already exists for either of the values
	 *
	 * Example
	 *
	 *  bimap.assoc('a', 'b') // a <-> b
	 *  bimap.assoc('c', 'd') // a <-> b, c <-> d
	 *
	 *  attemting to add a new association with any existing value will override old associations
	 *  bimap.assoc('b', 'e') // c <-> d, b <-> e
	 *  bimap.assoc('e', 'd') // e <-> d
	 *
	 */
	assoc(left: K, right: K): void {
		// remove old associations
		this.deAssoc(left)
		this.deAssoc(right)

		this.map.set(left, right)
		this.ls.add(left)
		this.map.set(right, left)
		this.rs.add(right)
	}

	/**
	 * Deassociate a value and remove it from this BiMap. Deassociating a value will remove the value and
	 * also remove the other value associated with it.
	 */
	deAssoc(l: K): void {
		const r = this.map.get(l)
		this.map.delete(l)
		this.ls.delete(l)
		this.rs.delete(l)
		if (r) this.deAssoc(r)
	}

	/**
	 * Returns an associated value for key provided or undefined if an association does not exist.
	 * @param k
	 * @returns
	 */
	get(k: K): K | undefined {
		return this.map.get(k)
	}

	/**
	 * Checks if a value has been associated
	 * @param key
	 * @returns
	 */
	has(key: K): boolean {
		return this.map.has(key)
	}

	/**
	 * Returns the associations as an array of tuples.
	 * @returns
	 */
	entries(): Array<[K, K]> {
		const entries: Array<[K, K]> = []

		for (let entry of this.ls) {
			const r = this.map.get(entry)
			if (r !== undefined)
				// needed for type safety 😒
				entries.push([entry, r])
		}

		return entries
	}

	toString(): string {
		const p = [...this.ls].map(l => `${l} <-> ${this.map.get(l)}`)
		return `BiMap(${p.join(', ')})`
	}

	print() {
		console.log(this.toString())
	}
}
