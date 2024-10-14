### Couchbase CA Certificate Hierarchy

In Couchbase, the **Certificate Authority (CA) hierarchy** is an essential part of securing communications between clients, nodes, and other services in a Couchbase cluster using **Transport Layer Security (TLS)**. This hierarchy plays a key role in managing the trust relationships between entities (clients and nodes) in the cluster. Couchbase uses **X.509 certificates** for authentication and encryption, and the certificate hierarchy ensures that these certificates are trusted and verified.

#### Overview of CA Certificate Hierarchy in Couchbase

The CA hierarchy typically follows a **chain of trust** model. This chain includes:

1. **Root CA**: The highest level in the certificate hierarchy. It is self-signed and trusted by all entities in the Couchbase environment. The Root CA is used to sign and validate Intermediate CAs or end-entity certificates.
   
2. **Intermediate CA** (optional): An intermediate authority that sits between the Root CA and the end-entity certificates. Intermediate CAs are used to issue and sign server or client certificates. This allows for better security practices by keeping the Root CA offline and issuing certificates through an intermediate layer.

3. **End-entity Certificates** (e.g., Node Certificates): These are the actual certificates assigned to Couchbase nodes, clients, or services. They are signed by either the Root CA or an Intermediate CA, depending on the deployment setup. These certificates are used for authenticating and encrypting communications between nodes or between a client and a node.

#### Why Use a CA Hierarchy?

- **Security**: By having a multi-level hierarchy with a separate **Root CA** and **Intermediate CA(s)**, you can keep the Root CA offline and only use it for creating intermediate certificates. This reduces the risk of compromise.
- **Scalability**: A CA hierarchy helps manage large clusters with multiple nodes and services. Intermediate CAs can be used to issue certificates in different environments (e.g., production, test) without having to involve the Root CA directly.
- **Certificate Management**: A CA hierarchy simplifies certificate revocation and renewal. If an intermediate CA is compromised, you can revoke only that CA and its associated certificates without affecting the Root CA.

### Example of a Couchbase CA Hierarchy

1. **Root CA**:
   - The Root CA is used to establish trust in the Couchbase cluster. It can be either:
     - A **publicly trusted CA**, such as one from DigiCert or Let's Encrypt.
     - A **custom self-signed CA**, which is commonly used in private/internal networks where the CA is managed internally.

2. **Intermediate CA**:
   - The Root CA signs an Intermediate CA certificate, which can then be used to sign end-entity certificates (for Couchbase nodes or services). This intermediate layer allows the Root CA to remain offline and better protects it from exposure.

3. **Node Certificates**:
   - Each Couchbase node in the cluster is issued an individual certificate, which is signed by either the Root CA or an Intermediate CA. These certificates are used for:
     - **Node-to-Node encryption**: Securing communication between Couchbase nodes.
     - **Client-to-Node encryption**: Securing communication between clients (applications) and Couchbase nodes.
     - **REST API Security**: Securing management interactions through HTTPS on the Admin Console and REST API.

### Steps to Set Up a Couchbase CA Hierarchy

#### 1. Generate a Root CA Certificate

The Root CA will be self-signed and will be used to sign either the Intermediate CA or directly the Node certificates.

Example using **OpenSSL**:

```bash
# Generate the private key for the Root CA
openssl genrsa -out rootCA.key 4096

# Generate the Root CA certificate (self-signed)
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 3650 -out rootCA.crt
```

- **rootCA.key**: This is the private key of the Root CA.
- **rootCA.crt**: This is the public certificate of the Root CA, which will be used to sign other certificates.

#### 2. (Optional) Generate an Intermediate CA Certificate

An Intermediate CA can be used to sign the Node certificates. This step is optional but is considered a security best practice.

```bash
# Generate the private key for the Intermediate CA
openssl genrsa -out intermediateCA.key 4096

# Generate the Intermediate CA certificate signing request (CSR)
openssl req -new -key intermediateCA.key -out intermediateCA.csr

# Sign the Intermediate CA certificate with the Root CA
openssl x509 -req -in intermediateCA.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out intermediateCA.crt -days 1825 -sha256
```

- **intermediateCA.key**: The private key of the Intermediate CA.
- **intermediateCA.crt**: The Intermediate CA certificate, signed by the Root CA.

#### 3. Generate Node Certificates (Signed by Intermediate or Root CA)

For each Couchbase node, generate individual certificates. These will be used to secure communication between the nodes.

```bash
# Generate the private key for a Couchbase node
openssl genrsa -out node1.key 2048

# Generate the certificate signing request (CSR) for the Couchbase node
openssl req -new -key node1.key -out node1.csr

# Sign the node certificate with the Intermediate CA (or Root CA if no Intermediate CA is used)
openssl x509 -req -in node1.csr -CA intermediateCA.crt -CAkey intermediateCA.key -CAcreateserial -out node1.crt -days 825 -sha256
```

- **node1.key**: The private key of the Couchbase node.
- **node1.crt**: The certificate for the Couchbase node, signed by the Intermediate CA (or Root CA if no Intermediate is used).

Repeat the above process for each node in the Couchbase cluster.

#### 4. Distribute Certificates to Couchbase Nodes

Once the certificates are generated:

1. **Distribute the certificates and private keys** to the respective nodes.
2. Configure Couchbase to use these certificates.

### Configuring Couchbase to Use the CA Hierarchy

In Couchbase, you can configure the nodes to use the certificates by either:

1. **Using Couchbase Admin UI**:
   - Navigate to **Security** → **Certificates** in the Couchbase Web Console.
   - Upload the **Node Certificates** (both the public key and private key) and **CA Certificates**.

2. **Using Couchbase CLI**:
   You can use the Couchbase CLI to upload certificates.

Example:
```bash
couchbase-cli setting-security --cluster <cluster-ip> --cert-path /path/to/node1.crt --key-path /path/to/node1.key --cacert-path /path/to/rootCA.crt
```

### Certificate Chain Validation in Couchbase

When Couchbase nodes or clients connect to each other using TLS, the certificates are validated by checking the chain of trust:

1. The **end-entity certificate** (e.g., Node certificate) is checked to see if it was signed by a **trusted Intermediate CA** or **Root CA**.
2. The chain is followed up to the **Root CA**. If the Root CA is trusted by all parties (i.e., its public certificate is installed on all nodes and clients), the connection is considered secure.
3. **Revocation checks** can also be performed (if enabled) to ensure that none of the certificates in the chain have been revoked.

### Revocation of Certificates

In case a certificate gets compromised or needs to be revoked, you can:

- Use **Certificate Revocation Lists (CRLs)**: A list of revoked certificates maintained by the CA.
- Use **Online Certificate Status Protocol (OCSP)**: A real-time protocol that checks the status of a certificate.

Ensure that all Couchbase nodes are configured to check revocation lists if needed.

### Conclusion

A proper **CA hierarchy** in Couchbase allows for secure communication between nodes and clients using TLS. By establishing a Root CA and (optionally) Intermediate CAs, Couchbase can ensure a scalable, secure, and manageable system for certificate issuance and management. This approach not only enhances security but also supports compliance with industry standards and best practices for securing distributed systems.