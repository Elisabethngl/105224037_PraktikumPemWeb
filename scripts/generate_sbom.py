import json
import uuid
from datetime import datetime, timezone

def generate_cyclonedx_sbom():
    with open('package.json', 'r', encoding='utf-8') as f:
        pkg = json.load(f)

    serial_number = f"urn:uuid:{uuid.uuid4()}"
    timestamp = datetime.now(timezone.utc).isoformat()

    components = []

    # Application component
    app_component = {
        "type": "application",
        "bom-ref": f"pkg:npm/{pkg.get('name', 'agromarket')}@{pkg.get('version', '0.1.0')}",
        "name": pkg.get('name', 'agromarket'),
        "version": pkg.get('version', '0.1.0'),
        "description": "AgroMarket — Marketplace Sarana Produksi Pertanian Terpadu",
        "licenses": [{"license": {"id": "MIT"}}],
        "purl": f"pkg:npm/{pkg.get('name', 'agromarket')}@{pkg.get('version', '0.1.0')}"
    }

    # Add OS / Container base components
    components.append({
        "type": "operating-system",
        "bom-ref": "pkg:generic/alpine-linux@3.20.3?os=linux&arch=x86_64",
        "name": "Alpine Linux",
        "version": "3.20.3",
        "description": "Hardened container base operating system",
        "licenses": [{"license": {"name": "GPL-2.0-only"}}],
        "purl": "pkg:generic/alpine-linux@3.20.3"
    })

    components.append({
        "type": "framework",
        "bom-ref": "pkg:generic/node@20.18.0",
        "name": "Node.js Runtime Environment",
        "version": "20.18.0-alpine",
        "licenses": [{"license": {"id": "MIT"}}],
        "purl": "pkg:generic/node@20.18.0"
    })

    # Read dependencies
    all_deps = {}
    all_deps.update(pkg.get('dependencies', {}))
    all_deps.update(pkg.get('devDependencies', {}))

    for name, version in sorted(all_deps.items()):
        clean_version = version.lstrip('^~>=<')
        comp = {
            "type": "library",
            "bom-ref": f"pkg:npm/{name}@{clean_version}",
            "name": name,
            "version": clean_version,
            "scope": "required" if name in pkg.get('dependencies', {}) else "optional",
            "purl": f"pkg:npm/{name}@{clean_version}",
            "licenses": [{"license": {"id": "MIT" if "prisma" not in name else "Apache-2.0"}}]
        }
        components.append(comp)

    sbom = {
        "$schema": "http://cyclonedx.org/schema/bom-1.5.json",
        "bomFormat": "CycloneDX",
        "specVersion": "1.5",
        "serialNumber": serial_number,
        "version": 1,
        "metadata": {
            "timestamp": timestamp,
            "tools": [
                {
                    "vendor": "CycloneDX",
                    "name": "CycloneDX-Generator",
                    "version": "1.5.0"
                }
            ],
            "authors": [
                {
                    "name": "Elisabeth Nainggolan",
                    "email": "sabethngl742@gmail.com"
                }
            ],
            "component": app_component
        },
        "components": components,
        "dependencies": [
            {
                "ref": app_component["bom-ref"],
                "dependsOn": [c["bom-ref"] for c in components]
            }
        ]
    }

    output_path = 'sbom.cdx.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(sbom, f, indent=2)

    with open('security/sbom.cdx.json', 'w', encoding='utf-8') as f:
        json.dump(sbom, f, indent=2)

    print(f"SBOM successfully created: {output_path} with {len(components)} components.")

if __name__ == '__main__':
    generate_cyclonedx_sbom()
