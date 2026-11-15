const cleanIdentifier = (value, fallback) => {
	const identifier = value.trim().replace(/[^a-zA-Z0-9_$]/g, "");
	return identifier || fallback;
};

const parseMethod = (method) => {
	const signature = method.name.trim();
	const match = signature.match(/^([\w$]+)\s*\((.*)\)$/);

	if (!match) {
		return { name: cleanIdentifier(signature, "method"), parameters: "" };
	}

	const parameters = match[2]
		.split(",")
		.map((parameter) => parameter.trim())
		.filter(Boolean)
		.map((parameter) => {
			const [name, type = "Object"] = parameter.split(":").map((part) => part.trim());
			return `${type || "Object"} ${cleanIdentifier(name, "value")}`;
		})
		.join(", ");

	return { name: cleanIdentifier(match[1], "method"), parameters };
};

export function generateJavaClass(node, edges, nodes) {
	const parentEdge = edges.find(
		(edge) => edge.target === node.id && edge.label?.toLowerCase() === "extends"
	);
	const parent = parentEdge ? nodes.find((item) => item.id === parentEdge.source) : null;
	const className = cleanIdentifier(node.data.name, "UnnamedClass");
	const inheritance = parent ? ` extends ${cleanIdentifier(parent.data.name, "BaseClass")}` : "";
	const attributes = node.data.attributes
		.filter((attribute) => attribute.name.trim())
		.map((attribute) => `    private ${attribute.type || "Object"} ${cleanIdentifier(attribute.name, "value")};`)
		.join("\n");
	const methods = node.data.methods
		.filter((method) => method.name.trim())
		.map((method) => {
			const parsed = parseMethod(method);
			return `    public ${method.type || "void"} ${parsed.name}(${parsed.parameters}) {\n        // TODO: implement\n    }`;
		})
		.join("\n\n");

	return `public class ${className}${inheritance} {\n\n${attributes || "    // No attributes defined"}\n\n${methods || "    // No methods defined"}\n}`;
}

export function generateJavaFiles(nodes, edges) {
	return nodes.map((node) => ({
		id: node.id,
		name: `${cleanIdentifier(node.data.name, "UnnamedClass")}.java`,
		code: generateJavaClass(node, edges, nodes)
	}));
}
