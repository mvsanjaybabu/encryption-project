async function encrypt() {
    const input = document.getElementById("inputText").value;
    const textEncoder = new TextEncoder();
    const encodedData = textEncoder.encode(input);
    const key = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedData
    );
    
    const encryptedText = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
    document.getElementById("encryptedText").value = encryptedText;
    document.getElementById("encryptedText").setAttribute("data-iv", JSON.stringify(Array.from(iv)));
    document.getElementById("encryptedText").setAttribute("data-key", JSON.stringify(await window.crypto.subtle.exportKey("jwk", key)));
}

async function decrypt() {
    const encryptedText = document.getElementById("encryptedText").value;
    const encryptedData = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
    const iv = new Uint8Array(JSON.parse(document.getElementById("encryptedText").getAttribute("data-iv")));
    const key = await window.crypto.subtle.importKey(
        "jwk",
        JSON.parse(document.getElementById("encryptedText").getAttribute("data-key")),
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedData
    );
    
    const textDecoder = new TextDecoder();
    const decryptedText = textDecoder.decode(decryptedData);
    document.getElementById("decryptedText").value = decryptedText;
}
