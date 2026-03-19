import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Nama harus diisi'),
  email: z.string().trim().email('Email tidak valid'),
  subject: z.string().trim().min(1, 'Subjek harus diisi'),
  message: z.string().trim().min(1, 'Pesan harus diisi'),
});

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'tazkiashark@gmail.com',
    href: 'mailto:tazkiashark@gmail.com',
  },
  {
    icon: Phone,
    label: 'Telepon',
    value: '+62 83822966103',
    href: 'tel:+6283822966103',
  },
  {
    icon: MapPin,
    label: 'Lokasi',
    value: 'Aceh, Indonesia',
    href: 'https://maps.google.com/?q=Aceh',
  },
];

// animation
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Nama: ${formData.name}\nEmail: ${formData.email}\n\nPesan:\n${formData.message}`
      );

      window.location.href = `mailto:tazkiashark@gmail.com?subject=${subject}&body=${body}`;

      toast({
        title: 'Membuka Email ✉️',
        description: 'Silakan kirim email dari aplikasi Anda.',
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      toast({
        title: 'Gagal',
        description: 'Tidak bisa membuka email client',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-2 block">Kontak</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Hubungi Saya
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* LEFT */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            className="space-y-8"
          >
            <motion.div variants={item}>
              <h3 className="text-2xl font-bold mb-4">
                Mari Berkolaborasi!
              </h3>
              <p className="text-muted-foreground">
                Punya project atau ide? Yuk ngobrol 🚀
              </p>
            </motion.div>

            <div className="space-y-4">
              {contactInfo.map((info) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  variants={item}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="flex items-center gap-4 p-4 glass rounded-xl 
                  transition-all duration-300
                  hover:shadow-2xl hover:bg-primary/5"
                >
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    className="p-3 bg-primary/10 rounded-lg"
                  >
                    <info.icon className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    <p className="font-medium">{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6 glass rounded-2xl shadow-lg
              transition-all duration-300 hover:shadow-2xl"
            >
              {/* NAME */}
              <Input
                name="name"
                placeholder="Nama Anda"
                value={formData.name}
                onChange={handleChange}
                className={`transition-all duration-300 
                hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/30
                ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

              {/* EMAIL */}
              <Input
                name="email"
                type="email"
                placeholder="Email Anda"
                value={formData.email}
                onChange={handleChange}
                className={`transition-all duration-300 
                hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/30
                ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

              {/* SUBJECT */}
              <Input
                name="subject"
                placeholder="Subjek"
                value={formData.subject}
                onChange={handleChange}
                className={`transition-all duration-300 
                hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/30
                ${errors.subject ? 'border-red-500' : ''}`}
              />
              {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}

              {/* MESSAGE */}
              <Textarea
                name="message"
                placeholder="Pesan..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className={`transition-all duration-300 
                hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/30
                ${errors.message ? 'border-red-500' : ''}`}
              />
              {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}

              {/* BUTTON */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Button
                  type="submit"
                  className="w-full rounded-full 
                  transition-all duration-300 
                  hover:shadow-xl hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Membuka...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Kirim Email
                    </>
                  )}
                </Button>
              </motion.div>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}